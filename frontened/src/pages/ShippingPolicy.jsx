
import { FaTruck, FaBox, FaMapMarkerAlt } from "react-icons/fa";

const ShippingPolicy = () => {
  return (
    <div className="bg-white text-gray-800">


      <section className="bg-gray-100 py-14 text-center">
        <h1 className="text-4xl font-bold">
          Shipping Policy
        </h1>

        <p className="text-gray-500 mt-3">
          Everything you need to know about product delivery.
        </p>
      </section>


      <section className="max-w-4xl mx-auto p-6 md:p-12">

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">

          <div className="border rounded-lg p-6 text-center">
            <FaTruck className="text-3xl mx-auto mb-3" />
            <h3 className="font-bold">Order Delivery</h3>
            <p className="text-gray-500 text-sm mt-2">
              Orders are delivered to your provided address.
            </p>
          </div>

          <div className="border rounded-lg p-6 text-center">
            <FaBox className="text-3xl mx-auto mb-3" />
            <h3 className="font-bold">Safe Packaging</h3>
            <p className="text-gray-500 text-sm mt-2">
              Products are packed carefully before dispatch.
            </p>
          </div>

          <div className="border rounded-lg p-6 text-center">
            <FaMapMarkerAlt className="text-3xl mx-auto mb-3" />
            <h3 className="font-bold">Delivery Address</h3>
            <p className="text-gray-500 text-sm mt-2">
              Please provide an accurate delivery address.
            </p>
          </div>

        </div>

        <h2 className="text-2xl font-bold mb-4">
          Shipping Information
        </h2>

        <p className="text-gray-600 leading-7 mb-6">
          MyStore aims to provide a smooth and convenient
          delivery experience. Customers should ensure
          that their shipping address and contact details
          are correct when placing an order.
        </p>

        <h2 className="text-xl font-bold mb-3">
          Order Tracking
        </h2>

        <p className="text-gray-600 leading-7 mb-6">
          Order tracking information will be provided
          when tracking becomes available for your order.
        </p>

        <h2 className="text-xl font-bold mb-3">
          Delivery Issues
        </h2>

        <p className="text-gray-600 leading-7">
          If you experience a delivery issue, please
          contact our customer support team for assistance.
        </p>

      </section>

    </div>
  );
};

export default ShippingPolicy;
