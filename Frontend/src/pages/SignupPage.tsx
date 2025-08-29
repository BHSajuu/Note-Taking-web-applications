

const SignupPage = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Create an Account</h1>
          <p className="text-gray-500">Let's get started with your 30-day free trial.</p>
        </div>

        <form className="space-y-6">
          <div>
            <label htmlFor="name" className="text-sm font-medium">Name</label>
            <input id="name" type="text" placeholder="Enter your name" className="w-full p-3 mt-1 border rounded-md" />
          </div>
          <div>
            <label htmlFor="email" className="text-sm font-medium">Email</label>
            <input id="email" type="email" placeholder="Enter your email" className="w-full p-3 mt-1 border rounded-md" />
          </div>
          
          {/* We will add OTP field conditionally later */}

          <button type="submit" className="w-full py-3 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700">
            Get OTP
          </button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 text-gray-500 bg-white">OR</span>
          </div>
        </div>

        <button className="w-full py-3 font-semibold border rounded-md flex items-center justify-center">
          {/* Add Google Icon from assets here */}
          <span className="ml-2">Sign up with Google</span>
        </button>

        <p className="text-sm text-center text-gray-600">
          Already have an account? <a href="#" className="font-medium text-blue-600 hover:underline">Log in</a>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;