
import { FaShoppingBag, FaBullseye, FaUsers } from "react-icons/fa";

const About = () => {
  return (
    <div className="bg-white text-gray-800">


      <section className="bg-gray-100 p-10 md:p-20 text-center">
        <h1 className="text-4xl md:text-5xl font-bold">
          About MyStore
        </h1>

        <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
          Your destination for quality products, great prices
          and a convenient shopping experience.
        </p>
      </section>


      <section className="p-6 md:p-16 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">

        <img
          src="https://images.unsplash.com/photo-1607082349566-187342175e2f?w=1000"
          alt="Online shopping"
          className="w-full h-80 object-cover rounded-lg"
        />

        <div>
          <h2 className="text-3xl font-bold mb-5">
            Who We Are
          </h2>

          <p className="text-gray-600 leading-7">
            MyStore is an online shopping platform where
            customers can explore a wide range of products
            across different categories.
          </p>

          <p className="text-gray-600 leading-7 mt-4">
            From electronics and fashion to home essentials
            and accessories, we aim to make everyday shopping
            simple and convenient.
          </p>
        </div>

      </section>


      <section className="bg-gray-100 p-8 md:p-16">

        <h2 className="text-3xl font-bold text-center mb-10">
          What We Believe In
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          <div className="bg-white p-7 rounded-lg text-center shadow-sm">
            <FaShoppingBag className="text-4xl mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-3">
              Quality Products
            </h3>
            <p className="text-gray-600">
              Offering products across different categories
              for everyday needs.
            </p>
          </div>

          <div className="bg-white p-7 rounded-lg text-center shadow-sm">
            <FaBullseye className="text-4xl mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-3">
              Our Mission
            </h3>
            <p className="text-gray-600">
              Making online shopping simple, accessible
              and convenient.
            </p>
          </div>

          <div className="bg-white p-7 rounded-lg text-center shadow-sm">
            <FaUsers className="text-4xl mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-3">
              Customer First
            </h3>
            <p className="text-gray-600">
              Creating a smooth and enjoyable shopping
              experience for customers.
            </p>
          </div>

        </div>
      </section>

    </div>
  );
};

export default About;
