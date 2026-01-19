import { useState, useEffect } from 'react';
import { User, Calendar, ShoppingBag, LogOut, Clock, Check, X as XIcon } from 'lucide-react@0.487.0';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../utils/supabase/client';

interface Booking {
  id: string;
  service_name: string;
  service_price: string;
  date: string;
  time: string;
  status: string;
  vehicle_model: string;
  vehicle_plate: string;
  created_at: string;
}

interface Order {
  id: string;
  total_amount: number;
  status: string;
  payment_method: string;
  created_at: string;
}

export function ClientDashboard() {
  const { profile, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'bookings' | 'orders'>('profile');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    if (!profile) return;

    try {
      // Carregar agendamentos
      const { data: bookingsData, error: bookingsError } = await supabase
        .from('bookings')
        .select('*')
        .eq('user_id', profile.id)
        .order('created_at', { ascending: false });

      if (bookingsError) throw bookingsError;
      setBookings(bookingsData || []);

      // Carregar pedidos
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', profile.id)
        .order('created_at', { ascending: false });

      if (ordersError) throw ordersError;
      setOrders(ordersData || []);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      pending: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
      confirmed: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
      completed: 'bg-green-500/10 text-green-400 border-green-500/20',
      cancelled: 'bg-red-500/10 text-red-400 border-red-500/20',
      paid: 'bg-green-500/10 text-green-400 border-green-500/20',
    };

    const labels = {
      pending: 'Pendente',
      confirmed: 'Confirmado',
      completed: 'Concluído',
      cancelled: 'Cancelado',
      paid: 'Pago',
    };

    return (
      <span className={`px-3 py-1 rounded-full text-xs border ${styles[status as keyof typeof styles] || styles.pending}`}>
        {labels[status as keyof typeof labels] || status}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="bg-secondary border-b border-primary/20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-black text-xl">🍋</span>
              </div>
              <div>
                <h1 className="text-xl">Minha Conta</h1>
                <p className="text-sm text-gray-400">Lemon's Car</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <a
                href="/"
                className="text-gray-400 hover:text-primary transition-colors"
              >
                Voltar ao Site
              </a>
              <button
                onClick={() => signOut()}
                className="flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 hover:bg-red-500/20 transition-all"
              >
                <LogOut className="w-4 h-4" />
                Sair
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="bg-secondary border border-primary/20 rounded-xl p-6 mb-6">
              <div className="bg-primary/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="w-10 h-10 text-primary" />
              </div>
              <h2 className="text-center text-xl text-white mb-1">{profile?.full_name}</h2>
              <p className="text-center text-sm text-gray-400 mb-4">{profile?.email}</p>
              <div className="bg-primary/5 border border-primary/20 rounded-lg p-3 text-center">
                <p className="text-xs text-gray-400 mb-1">Telefone</p>
                <p className="text-white">{profile?.phone}</p>
              </div>
            </div>

            <nav className="bg-secondary border border-primary/20 rounded-xl p-4 space-y-2">
              <button
                onClick={() => setActiveTab('profile')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  activeTab === 'profile'
                    ? 'bg-primary text-black'
                    : 'text-gray-400 hover:bg-primary/10 hover:text-primary'
                }`}
              >
                <User className="w-5 h-5" />
                Meu Perfil
              </button>
              <button
                onClick={() => setActiveTab('bookings')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  activeTab === 'bookings'
                    ? 'bg-primary text-black'
                    : 'text-gray-400 hover:bg-primary/10 hover:text-primary'
                }`}
              >
                <Calendar className="w-5 h-5" />
                Agendamentos
                {bookings.length > 0 && (
                  <span className="ml-auto bg-primary/20 text-primary px-2 py-1 rounded-full text-xs">
                    {bookings.length}
                  </span>
                )}
              </button>
              <button
                onClick={() => setActiveTab('orders')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  activeTab === 'orders'
                    ? 'bg-primary text-black'
                    : 'text-gray-400 hover:bg-primary/10 hover:text-primary'
                }`}
              >
                <ShoppingBag className="w-5 h-5" />
                Pedidos
                {orders.length > 0 && (
                  <span className="ml-auto bg-primary/20 text-primary px-2 py-1 rounded-full text-xs">
                    {orders.length}
                  </span>
                )}
              </button>
            </nav>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-3">
            {activeTab === 'profile' && (
              <div className="bg-secondary border border-primary/20 rounded-xl p-6">
                <h2 className="text-2xl text-white mb-6">Meu Perfil</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Nome Completo</label>
                    <input
                      type="text"
                      value={profile?.full_name}
                      disabled
                      className="w-full bg-black border border-primary/20 rounded-lg px-4 py-3 text-white opacity-60"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">E-mail</label>
                    <input
                      type="email"
                      value={profile?.email}
                      disabled
                      className="w-full bg-black border border-primary/20 rounded-lg px-4 py-3 text-white opacity-60"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Telefone</label>
                    <input
                      type="tel"
                      value={profile?.phone}
                      disabled
                      className="w-full bg-black border border-primary/20 rounded-lg px-4 py-3 text-white opacity-60"
                    />
                  </div>
                  <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                    <p className="text-sm text-blue-400">
                      💡 Para alterar seus dados, entre em contato conosco pelo WhatsApp.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'bookings' && (
              <div className="space-y-4">
                <h2 className="text-2xl text-white mb-6">Meus Agendamentos</h2>
                {loading ? (
                  <div className="bg-secondary border border-primary/20 rounded-xl p-12 text-center">
                    <p className="text-gray-400">Carregando...</p>
                  </div>
                ) : bookings.length === 0 ? (
                  <div className="bg-secondary border border-primary/20 rounded-xl p-12 text-center">
                    <Calendar className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <h3 className="text-xl text-white mb-2">Nenhum agendamento ainda</h3>
                    <p className="text-gray-400 mb-4">
                      Faça seu primeiro agendamento e aproveite nossos serviços!
                    </p>
                    <a
                      href="/#booking"
                      className="inline-block bg-primary text-black px-6 py-3 rounded-lg hover:bg-primary/90 transition-all"
                    >
                      Agendar Serviço
                    </a>
                  </div>
                ) : (
                  bookings.map((booking) => (
                    <div key={booking.id} className="bg-secondary border border-primary/20 rounded-xl p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-xl text-white mb-1">{booking.service_name}</h3>
                          <p className="text-gray-400 text-sm">
                            {booking.vehicle_model} - {booking.vehicle_plate}
                          </p>
                        </div>
                        {getStatusBadge(booking.status)}
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-gray-400 mb-1">Data</p>
                          <p className="text-white">{booking.date}</p>
                        </div>
                        <div>
                          <p className="text-gray-400 mb-1">Horário</p>
                          <p className="text-white">{booking.time}</p>
                        </div>
                        <div>
                          <p className="text-gray-400 mb-1">Valor</p>
                          <p className="text-primary font-semibold">{booking.service_price}</p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab === 'orders' && (
              <div className="space-y-4">
                <h2 className="text-2xl text-white mb-6">Meus Pedidos</h2>
                {loading ? (
                  <div className="bg-secondary border border-primary/20 rounded-xl p-12 text-center">
                    <p className="text-gray-400">Carregando...</p>
                  </div>
                ) : orders.length === 0 ? (
                  <div className="bg-secondary border border-primary/20 rounded-xl p-12 text-center">
                    <ShoppingBag className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <h3 className="text-xl text-white mb-2">Nenhum pedido realizado</h3>
                    <p className="text-gray-400">
                      Seus pedidos e pagamentos aparecerão aqui.
                    </p>
                  </div>
                ) : (
                  orders.map((order) => (
                    <div key={order.id} className="bg-secondary border border-primary/20 rounded-xl p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-lg text-white mb-1">Pedido #{order.id.slice(0, 8)}</h3>
                          <p className="text-gray-400 text-sm">
                            {new Date(order.created_at).toLocaleDateString('pt-BR', {
                              day: '2-digit',
                              month: 'long',
                              year: 'numeric',
                            })}
                          </p>
                        </div>
                        {getStatusBadge(order.status)}
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-400 mb-1">Método de Pagamento</p>
                          <p className="text-white capitalize">
                            {order.payment_method.replace('_', ' ')}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-400 mb-1">Valor Total</p>
                          <p className="text-primary font-semibold">
                            R$ {order.total_amount.toFixed(2).replace('.', ',')}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}