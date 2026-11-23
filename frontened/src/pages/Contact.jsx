
import {
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt
} from "react-icons/fa";

const Contact = () => {

  return (
    <div className="bg-white text-gray-800">



      <section className="bg-gray-100 p-12 text-center">
        <h1 className="text-4xl md:text-5xl font-bold">
          Contact Us
        </h1>

        <p className="text-gray-600 mt-4">
          We'd love to hear from you. Get in touch with us.
        </p>
      </section>



      <section className="p-6 md:p-16">

        <div className="mx-auto max-w-5xl">

          <h2 className="text-3xl font-bold mb-8">
            Get In Touch
          </h2>



          <div className="flex items-center gap-4 mb-7">

            <FaEnvelope className="text-2xl" />

            <div>
              <h3 className="font-bold">
                Email
              </h3>

              <a
                href="mailto:Abirde10@gmail.com"
                className="text-gray-600 hover:text-blue-600"
              >
                Abirde10@gmail.com
              </a>
            </div>

          </div>



          <div className="flex items-center gap-4 mb-7">

            <FaPhone className="text-2xl" />

            <div>
              <h3 className="font-bold">
                Phone
              </h3>

              <a
                href="tel:+919330149337"
                className="text-gray-600 hover:text-blue-600"
              >
                +91 9330149337
              </a>
            </div>

          </div>



          <div className="flex items-center gap-4 mb-7">

            <FaMapMarkerAlt className="text-2xl" />

            <div>
              <h3 className="font-bold">
                Location
              </h3>

              <p className="text-gray-600">
                India
              </p>
            </div>

          </div>

        </div>

      </section>

    </div>
  );
};

export default Contact;
