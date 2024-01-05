import PropTypes from 'prop-types';

const LoginSignupForm = ({ type }) => {
    const title = type.charAt(0).toUpperCase() + type.substring(1);
    return (
        <div className="min-w-[50%] bg-[#efdfde] flex flex-col items-center justify-center px-2 py-20 rounded-md font-playfair">
            <h1 className="mb-8 text-xl font-bold">{title}</h1>
            <input
                type="text"
                placeholder="Enter your username"
                className="w-[70%] my-2 py-3 px-5 placeholder:text-left placeholder:text-sm rounded-md outline-none"
            />
            <input
                type="email"
                placeholder="Enter your email"
                className="w-[70%] my-2 py-3 px-5 placeholder:text-left placeholder:text-sm rounded-md outline-none"
            />
            <input
                placeholder="Enter your password"
                type="password"
                className="w-[70%] my-2 py-3 px-5 placeholder:text-left placeholder:text-sm rounded-md outline-none"
            />
            <button className="bg-[#6b251a] hover:bg-[#572119] text-white mt-8 px-6 py-2 rounded-md">
                {type}
            </button>
        </div>
    );
};

LoginSignupForm.propTypes = {
    type: PropTypes.string,
};

export default LoginSignupForm;
