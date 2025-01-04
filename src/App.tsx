import React, { useState } from 'react';

interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  sales: number;
  qrCode?: string;
}

interface Customer {
  id: number;
  name: string;
  email: string;
  totalSpent: number;
  loyaltyPoints: number;
}

const initialProducts: Product[] = [
  { id: 1, name: 'Laptop', price: 1200, stock: 50, sales: 20 },
  { id: 2, name: 'Keyboard', price: 100, stock: 100, sales: 50 },
  { id: 3, name: 'Mouse', price: 50, stock: 150, sales: 100 },
  { id: 4, name: 'Monitor', price: 300, stock: 30, sales: 10 },
  { id: 5, name: 'Headphones', price: 150, stock: 80, sales: 30 },
];

const initialCustomers: Customer[] = [
  { id: 1, name: 'John Doe', email: 'john.doe@example.com', totalSpent: 500, loyaltyPoints: 50 },
  { id: 2, name: 'Jane Smith', email: 'jane.smith@example.com', totalSpent: 1000, loyaltyPoints: 100 },
  { id: 3, name: 'Peter Jones', email: 'peter.jones@example.com', totalSpent: 250, loyaltyPoints: 25 },
];

const SmartRetailCompanion: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [loggedInCustomer, setLoggedInCustomer] = useState<Customer | null>(null);
  const [loginError, setLoginError] = useState('');
  const [isCustomerLoginVisible, setIsCustomerLoginVisible] = useState(true);
  const [isCustomerDashboardVisible, setIsCustomerDashboardVisible] = useState(false);
  const [isCustomerSignupVisible, setIsCustomerSignupVisible] = useState(false);
  const [newCustomerName, setNewCustomerName] = useState('');
  const [newCustomerEmail, setNewCustomerEmail] = useState('');
  const [newCustomerPassword, setNewCustomerPassword] = useState('');

  const handleCustomerLogin = () => {
    const customer = customers.find(c => c.name === customerName && c.email === customerEmail);
    if (customer) {
      setLoggedInCustomer(customer);
      setIsCustomerLoginVisible(false);
      setIsCustomerDashboardVisible(true);
      setLoginError('');
    } else {
      setLoginError('Invalid credentials. Please try again.');
    }
  };

  const handleLogout = () => {
    setLoggedInCustomer(null);
    setIsCustomerLoginVisible(true);
    setIsCustomerDashboardVisible(false);
  };

  const adjustPrice = (product: Product): number => {
      let newPrice = product.price;
      if (product.stock < 20 && product.sales > 20) {
        newPrice += product.price * 0.1;
      } else if(product.stock > 100 && product.sales < 10) {
          newPrice -= product.price * 0.05;
      }
      return parseFloat(newPrice.toFixed(2));
    };

    const handlePurchase = (product: Product) => {
      if (product.stock > 0) {
          const updatedProducts = products.map(p =>
            p.id === product.id ? { ...p, stock: p.stock - 1, sales: p.sales + 1 } : p
          );
          setProducts(updatedProducts);

          if(loggedInCustomer) {
              const updatedCustomer = {
                  ...loggedInCustomer,
                  totalSpent: loggedInCustomer.totalSpent + product.price,
                  loyaltyPoints: loggedInCustomer.loyaltyPoints + Math.floor(product.price * 0.05),
              };
              const updatedCustomers = customers.map(c => c.id === updatedCustomer.id ? updatedCustomer : c);
              setCustomers(updatedCustomers);
              setLoggedInCustomer(updatedCustomer);
          }

      } else {
          alert("Out of stock");
      }
    };

    const handleSignup = () => {
      const newId = customers.length > 0 ? Math.max(...customers.map(c => c.id)) + 1 : 1;
        const newCustomer = {
          id: newId,
          name: newCustomerName,
          email: newCustomerEmail,
          totalSpent: 0,
          loyaltyPoints: 0,
      };
      setCustomers([...customers, newCustomer]);
      setNewCustomerName('');
      setNewCustomerEmail('');
      setNewCustomerPassword('');
      setIsCustomerSignupVisible(false);
      setIsCustomerLoginVisible(true);
    }

    const toggleSignupVisibility = () => {
        setIsCustomerLoginVisible(false);
        setIsCustomerSignupVisible(true);
    };

    const cancelSignup = () => {
      setIsCustomerLoginVisible(true);
      setIsCustomerSignupVisible(false);
    }


  return (
      <div className="bg-gray-100 min-h-screen p-8">
        <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">Smart Retail Companion</h1>

          {isCustomerLoginVisible && (
            <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">Customer Login</h2>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="customerName">
                  Name
                </label>
                <input
                  type="text"
                  id="customerName"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={customerName}
                  onChange={e => setCustomerName(e.target.value)}
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="customerEmail">
                  Email
                </label>
                <input
                  type="email"
                  id="customerEmail"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={customerEmail}
                  onChange={e => setCustomerEmail(e.target.value)}
                />
              </div>
              {loginError && <p className="text-red-500 text-sm italic mb-4">{loginError}</p>}
              <div className="flex justify-between">
                  <button
                      onClick={handleCustomerLogin}
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  >
                      Login
                  </button>
                    <button
                    onClick={toggleSignupVisibility}
                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                      Sign Up
                  </button>
              </div>

            </div>
          )}

            {isCustomerSignupVisible && (
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">Customer Sign Up</h2>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="newCustomerName">
                            Name
                        </label>
                        <input
                            type="text"
                            id="newCustomerName"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            value={newCustomerName}
                            onChange={e => setNewCustomerName(e.target.value)}
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="newCustomerEmail">
                            Email
                        </label>
                        <input
                            type="email"
                            id="newCustomerEmail"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            value={newCustomerEmail}
                            onChange={e => setNewCustomerEmail(e.target.value)}
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="newCustomerPassword">
                            Password
                        </label>
                        <input
                            type="password"
                            id="newCustomerPassword"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            value={newCustomerPassword}
                            onChange={e => setNewCustomerPassword(e.target.value)}
                        />
                    </div>
                    <div className="flex justify-between">
                        <button
                            onClick={handleSignup}
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        >
                            Sign Up
                        </button>
                          <button
                            onClick={cancelSignup}
                            className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            >
                              Cancel
                          </button>
                    </div>
                </div>
            )}


          {isCustomerDashboardVisible && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-800">Welcome, {loggedInCustomer?.name}!</h2>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Logout
                </button>
              </div>
                <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">
                    Your Loyalty Points: {loggedInCustomer?.loyaltyPoints}
                    </h3>
                </div>

                <h3 className="text-lg font-semibold text-gray-700 mb-4">Products</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {products.map(product => {
                      const adjustedPrice = adjustPrice(product);
                    return (
                        <div key={product.id} className="bg-white border border-gray-200 rounded-lg p-4">
                            <div className="flex flex-col items-center justify-center mb-2">
                                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-20 h-20 mb-2" />
                                <h4 className="text-md font-semibold text-gray-800">{product.name}</h4>
                            </div>
                            <p className="text-gray-700 text-sm">
                                Price: ${adjustedPrice}
                            </p>
                            <p className="text-gray-700 text-sm">
                                Stock: {product.stock}
                            </p>
                                <button
                                  onClick={() => handlePurchase(product)}
                                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4 focus:outline-none focus:shadow-outline"
                                  disabled={product.stock <= 0}
                                >
                                    {product.stock <= 0 ? "Out of Stock" : "Purchase"}
                                </button>

                        </div>
                    );
                  })}
              </div>
            </div>
          )}

          </div>
        </div>

  );
};

export default SmartRetailCompanion;