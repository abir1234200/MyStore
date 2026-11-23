
import { FaUndo, FaBoxOpen, FaHeadset } from "react-icons/fa";

const ReturnPolicy = () => {
  return (
    <div className="bg-white text-gray-800">


      <section className="bg-gray-100 py-14 text-center">
        <h1 className="text-4xl font-bold">
          Return Policy
        </h1>

        <p className="text-gray-500 mt-3">
          Simple and convenient product returns.
        </p>
      </section>


      <section className="max-w-4xl mx-auto p-6 md:p-12">

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">

          <div className="border rounded-lg p-6 text-center">
            <FaUndo className="text-3xl mx-auto mb-3" />
            <h3 className="font-bold">7-Day Returns</h3>
            <p className="text-gray-500 text-sm mt-2">
              Eligible products can be returned within 7 days.
            </p>
          </div>

          <div className="border rounded-lg p-6 text-center">
            <FaBoxOpen className="text-3xl mx-auto mb-3" />
            <h3 className="font-bold">Product Condition</h3>
            <p className="text-gray-500 text-sm mt-2">
              Products should be returned in their original condition.
            </p>
          </div>

          <div className="border rounded-lg p-6 text-center">
            <FaHeadset className="text-3xl mx-auto mb-3" />
            <h3 className="font-bold">Customer Support</h3>
            <p className="text-gray-500 text-sm mt-2">
              Contact our support team for return assistance.
            </p>
          </div>

        </div>

        <h2 className="text-2xl font-bold mb-4">
          Return Eligibility
        </h2>

        <p className="text-gray-600 leading-7 mb-6">
          Customers can request a return within 7 days
          of receiving an eligible product. Products
          should be unused and returned with their
          original packaging and accessories.
        </p>

        <h2 className="text-xl font-bold mb-3">
          How to Request a Return
        </h2>

        <p className="text-gray-600 leading-7 mb-6">
          Contact our customer support team with your
          order details and the reason for requesting
          a return.
        </p>

        <h2 className="text-xl font-bold mb-3">
          Refund Information
        </h2>

        <p className="text-gray-600 leading-7">
          Refund eligibility and processing details
          will be communicated after the returned
          product has been reviewed.
        </p>

      </section>

    </div>
  );
};

export default ReturnPolicy;
