import logo from './logo.svg';
import './App.css';

function App() {
    return (
        <div className='App bg-main'>
            <div className="bg-main flex min-h-screen items-center justify-center">
                <div className='w-2/5 h-full bg-white rounded-lg bg-card p-10 gap-6'>
                    <div className='gap-3'>
                        <div className='info-format'>User Name: </div>
                        <input type="text" className='info-input' placeholder="User Name" />
                    </div>
                    <div>
                        <div className='info-format'>Email Address: </div>
                        <input type="text" className='info-input' placeholder="Email Address" />
                    </div>
                    <div>
                        <div className='info-format'>Password: </div>
                        <input type="password" className='info-input' placeholder="Password" />
                    </div>
                    <button className='bg-main rounded-lg py-1 px-2 mt-2'>Login</button>
                </div>
            </div>
        </div>
    );
}

export default App;
