import LoginSignupForm from './utils/LoginSignupForm';

const App = () => {
    return (
        <div className="h-screen w-full flex justify-center items-center">
            <LoginSignupForm type={'Login'} />
        </div>
    );
};

export default App;
