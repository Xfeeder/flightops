-import DebugPanel from '../components/DebugPanel';
+import DebugPanel from '../components/DebugPanel';

 export default function Login() {
   // … existing state …
-  const [logs, setLogs] = useState([]);
-  const showDebug = new URLSearchParams(window.location.search).has('debug');
+  const [logs, setLogs] = useState([]);

   const log = (msg) => setLogs((all) => [...all, msg]);

   const handleLogin = async (e) => {
     e.preventDefault();
     log('🚀 handleLogin fired');
     log('🔑 attempting Firebase signIn…');

     try {
       await signInWithEmailAndPassword(auth, email, password);
       log('✅ Login successful');
       navigate('/', { replace: true });
     } catch (err) {
       log(`❌ Login failed: ${err.message}`);
       setError('Invalid credentials');
     }
   };

   return (
     <div>
       <h2>Login</h2>
       <form onSubmit={handleLogin}>
         {/* email & password inputs */}
         <button type="submit">Login</button>
       </form>

-      {showDebug && <DebugPanel messages={logs} />}
+      <DebugPanel messages={logs} />
     </div>
   );
 }