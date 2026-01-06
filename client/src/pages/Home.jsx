import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="text-center py-16">
      <h1 className="text-5xl font-bold text-gray-900 mb-4">
        Welcome to Happy Pot 🪴
      </h1>
      <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
        Discover, learn, and track your houseplants. Browse thousands of plant
        species with detailed care instructions to help your green friends
        thrive.
      </p>
      <div className="flex justify-center gap-4">
        <Link
          to="/library"
          className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 text-lg font-semibold"
        >
          Browse Plants
        </Link>
        <Link
          to="/register"
          className="px-8 py-3 bg-white text-green-600 border-2 border-green-600 rounded-lg hover:bg-green-50 text-lg font-semibold"
        >
          Get Started
        </Link>
      </div>

      <div className="mt-16 grid md:grid-cols-3 gap-8 text-left">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="text-3xl mb-4">📚</div>
          <h3 className="text-xl font-semibold mb-2">Extensive Library</h3>
          <p className="text-gray-600">
            Access information on thousands of houseplants with detailed care
            guides
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="text-3xl mb-4">🌱</div>
          <h3 className="text-xl font-semibold mb-2">Track Your Garden</h3>
          <p className="text-gray-600">
            Keep track of your personal plant collection and care schedule
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="text-3xl mb-4">💡</div>
          <h3 className="text-xl font-semibold mb-2">Care Tips</h3>
          <p className="text-gray-600">
            Get watering, lighting, and maintenance tips for each plant
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;
