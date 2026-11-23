
import {
  FaShieldAlt,
  FaUserShield,
  FaLock,
} from "react-icons/fa";

const PrivacyPolicy = () => {
  return (
    <div className="bg-white text-gray-800">


      <section className="bg-gray-100 py-14 text-center">
        <h1 className="text-4xl font-bold">
          Privacy Policy
        </h1>

        <p className="text-gray-500 mt-3">
          Your privacy and data security matter to us.
        </p>
      </section>


      <section className="max-w-4xl mx-auto p-6 md:p-12">

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">

          <div className="border rounded-lg p-6 text-center">
            <FaShieldAlt className="text-3xl mx-auto mb-3" />
            <h3 className="font-bold">Data Protection</h3>
            <p className="text-gray-500 text-sm mt-2">
              We aim to protect customer information.
            </p>
          </div>

          <div className="border rounded-lg p-6 text-center">
            <FaUserShield className="text-3xl mx-auto mb-3" />
            <h3 className="font-bold">Personal Information</h3>
            <p className="text-gray-500 text-sm mt-2">
              Customer information is used to provide services.
            </p>
          </div>

          <div className="border rounded-lg p-6 text-center">
            <FaLock className="text-3xl mx-auto mb-3" />
            <h3 className="font-bold">Secure Shopping</h3>
            <p className="text-gray-500 text-sm mt-2">
              We aim to keep shopping information secure.
            </p>
          </div>

        </div>

        <h2 className="text-2xl font-bold mb-4">
          Information We Collect
        </h2>

        <p className="text-gray-600 leading-7 mb-6">
          When customers use MyStore, we may collect
          information such as their name, email address,
          phone number and delivery address.
        </p>

        <h2 className="text-xl font-bold mb-3">
          How We Use Information
        </h2>

        <p className="text-gray-600 leading-7 mb-6">
          Customer information may be used to process
          orders, arrange deliveries, provide customer
          support and improve our services.
        </p>

        <h2 className="text-xl font-bold mb-3">
          Data Security
        </h2>

        <p className="text-gray-600 leading-7 mb-6">
          We aim to use appropriate security measures
          to protect customer information from
          unauthorized access.
        </p>

        <h2 className="text-xl font-bold mb-3">
          Contact Us
        </h2>

        <p className="text-gray-600 leading-7">
          For privacy-related questions, please contact
          our customer support team.
        </p>

      </section>

    </div>
  );
};

export default PrivacyPolicy;
