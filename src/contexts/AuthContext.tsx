import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../utils/supabase/client';
import type { User } from '@supabase/supabase-js';

interface Profile {
  id: string;
  email: string;
  full_name: string;
  phone: string;
  role: 'client' | 'admin';
}

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName: string, phone: string, role?: 'client' | 'admin') => Promise<void>;
  signOut: () => Promise<void>;
  isAdmin: boolean;
  dbConfigured: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [dbConfigured, setDbConfigured] = useState(false);

  useEffect(() => {
    // Verificar se o banco está configurado
    checkDatabaseConfiguration();

    // Verificar sessão atual
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        loadProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // Escutar mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        loadProfile(session.user.id);
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkDatabaseConfiguration = async () => {
    try {
      const { error } = await supabase
        .from('profiles')
        .select('id')
        .limit(1);

      setDbConfigured(!error);
    } catch (error) {
      setDbConfigured(false);
    }
  };

  const loadProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        // Se a tabela não existe, criar perfil mock
        console.log('Perfil não encontrado no banco, usando dados do auth');
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setProfile({
            id: user.id,
            email: user.email || '',
            full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Usuário',
            phone: user.user_metadata?.phone || '',
            role: 'client',
          });
        }
      } else {
        setProfile(data);
      }
    } catch (error) {
      console.error('Erro ao carregar perfil:', error);
      // Fallback para dados do auth
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setProfile({
          id: user.id,
          email: user.email || '',
          full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Usuário',
          phone: user.user_metadata?.phone || '',
          role: 'client',
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, fullName: string, phone: string, role: 'client' | 'admin' = 'client') => {
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            phone,
            role,
          },
          emailRedirectTo: window.location.origin,
        },
      });

      if (authError) throw authError;

      // Se o banco estiver configurado, tentar criar perfil
      if (dbConfigured && authData.user) {
        try {
          await supabase
            .from('profiles')
            .insert({
              id: authData.user.id,
              email,
              full_name: fullName,
              phone,
              role,
            });
        } catch (profileError) {
          console.log('Erro ao criar perfil (pode ser ignorado se o trigger estiver configurado):', profileError);
        }
      }

      // Se o email não precisa ser confirmado, fazer login automaticamente
      if (authData.session) {
        return; // Já está logado
      }

      throw new Error('Cadastro realizado! Por favor, confirme seu email antes de fazer login.');
    } catch (error: any) {
      console.error('Erro no cadastro:', error);
      
      // Mensagens de erro amigáveis
      if (error.message?.includes('Email not confirmed')) {
        throw new Error('Por favor, confirme seu email antes de fazer login.');
      } else if (error.message?.includes('already registered')) {
        throw new Error('Este email já está cadastrado. Tente fazer login.');
      } else if (error.message?.includes('after 1 seconds')) {
        throw new Error('Aguarde um momento antes de tentar novamente.');
      } else if (error.code === 'PGRST205') {
        throw new Error('Banco de dados não configurado. Configure em /admin → Setup Banco');
      } else if (error.message) {
        throw new Error(error.message);
      }
      
      throw new Error('Erro ao criar conta. Tente novamente.');
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
    } catch (error: any) {
      console.error('Erro no login:', error);
      
      // Mensagens de erro amigáveis
      if (error.message?.includes('Email not confirmed')) {
        throw new Error('Email não confirmado. Verifique sua caixa de entrada ou configure o Supabase para desabilitar confirmação (Auth → Settings → Enable email confirmations).');
      } else if (error.message?.includes('Invalid login credentials')) {
        throw new Error('Email ou senha incorretos.');
      } else if (error.message?.includes('after 1 seconds')) {
        throw new Error('Aguarde um momento antes de tentar novamente.');
      } else if (error.message) {
        throw new Error(error.message);
      }
      
      throw new Error('Erro ao fazer login. Verifique suas credenciais.');
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error: any) {
      console.error('Erro ao sair:', error);
      throw new Error(error.message || 'Erro ao sair');
    }
  };

  const isAdmin = profile?.role === 'admin';

  return (
    <AuthContext.Provider value={{ user, profile, loading, signIn, signUp, signOut, isAdmin, dbConfigured }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}