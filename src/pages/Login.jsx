// import { useState } from 'react';
// import { motion } from 'framer-motion';
// import { useNavigate } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';

// const Login = () => {
//   const navigate = useNavigate();
//   const { login } = useAuth();
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState('');

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     setIsLoading(true);
//     setError('');
    
//     const result = await login(email, password);
    
//     if (result.success) {
//       navigate('/');
//     } else {
//       setError(result.error);
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 to-indigo-900 overflow-hidden relative">
//       {/* Background Circles */}
//       <motion.div 
//         animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
//         transition={{ duration: 20, repeat: Infinity }}
//         className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30"
//       />
//       <motion.div 
//         animate={{ scale: [1, 1.1, 1], rotate: [0, -60, 0] }}
//         transition={{ duration: 15, repeat: Infinity }}
//         className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30"
//       />

//       <motion.div
//         initial={{ opacity: 0, y: 30, backdropFilter: 'blur(0px)' }}
//         animate={{ opacity: 1, y: 0, backdropFilter: 'blur(10px)' }}
//         className="bg-white/10 border border-white/20 p-8 rounded-2xl shadow-2xl w-full max-w-md backdrop-blur-md"
//       >
//         <div className="text-center mb-8">
//             <h2 className="text-4xl font-bold text-white mb-2 tracking-tight">iFactory</h2>
//             <p className="text-blue-100">Management System</p>
//         </div>

//         {error && (
//           <motion.div 
//             initial={{ opacity: 0, x: -20 }}
//             animate={{ opacity: 1, x: 0 }}
//             className="bg-red-500/20 border border-red-500/50 text-red-100 p-3 rounded-lg mb-6 text-sm text-center"
//           >
//             {error}
//           </motion.div>
//         )}

//         <form onSubmit={handleLogin} className="space-y-6">
//           <div>
//             <label className="block text-blue-100 text-sm font-medium mb-2">Email Address</label>
//             <input
//               type="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-blue-200/50 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
//               placeholder="admin@ifactory.com"
//               required
//             />
//           </div>
//           <div>
//             <label className="block text-blue-100 text-sm font-medium mb-2">Password</label>
//             <input
//               type="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-blue-200/50 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
//               placeholder="••••••••"
//               required
//             />
//           </div>
//           <button
//             type="submit"
//             disabled={isLoading}
//             className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold py-3 rounded-lg shadow-lg hover:shadow-blue-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-70"
//           >
//             {isLoading ? 'Signing In...' : 'Sign In'}
//           </button>
//         </form>
//       </motion.div>
//     </div>
//   );
// };

// export default Login;


import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false); // NEW

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const result = await login(email, password);

    if (result.success) {
      navigate('/');
    } else {
      setError(result.error);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 to-indigo-900 overflow-hidden relative">
      {/* Background Circles */}
      <motion.div 
        animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
        transition={{ duration: 20, repeat: Infinity }}
        className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30"
      />
      <motion.div 
        animate={{ scale: [1, 1.1, 1], rotate: [0, -60, 0] }}
        transition={{ duration: 15, repeat: Infinity }}
        className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30"
      />
      <motion.div
        initial={{ opacity: 0, y: 30, backdropFilter: 'blur(0px)' }}
        animate={{ opacity: 1, y: 0, backdropFilter: 'blur(10px)' }}
        className="bg-white/10 border border-white/20 p-8 rounded-2xl shadow-2xl w-full max-w-md backdrop-blur-md"
      >
        <div className="text-center mb-8">
            <h2 className="text-4xl font-bold text-white mb-2 tracking-tight">iFactory</h2>
            <p className="text-blue-100">Management System</p>
        </div>
        {error && (
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-red-500/20 border border-red-500/50 text-red-100 p-3 rounded-lg mb-6 text-sm text-center"
          >
            {error}
          </motion.div>
        )}
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-blue-100 text-sm font-medium mb-2">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-blue-200/50 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
              placeholder="admin@ifactory.com"
              required
            />
          </div>
          <div>
            <label className="block text-blue-100 text-sm font-medium mb-2">Password</label>
            {/* NEW: wrap input in a relative container to position the toggle icon */}
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 pr-11 bg-white/5 border border-white/10 rounded-lg text-white placeholder-blue-200/50 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-200/70 hover:text-white transition-colors"
                tabIndex={-1}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold py-3 rounded-lg shadow-lg hover:shadow-blue-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-70"
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default Login;
