import React from "react";
import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="w-full bg-(--secondary-theme) text-white  px-6 flex flex-col items-center justify-center py-20">
      <div className="w-[80%] sm:w-[60%] flex flex-wrap justify-between gap-8 grid-cols-1 sm:grid-cols-3">
        {/* Tasty Section */}
        <div className="w-60">
          <div className=" text-2xl my-5">Tasty</div>
          <p className="mb-4 text-md text-secondary ">
            Far far away, behind the word mountains, far from the countries
            Vokalia and Consonantia, there live the blind texts.
          </p>
          <div className="footercontact flex gap-4 mt-10">
            <a
              href="#"
              className="text-xl p-3 rounded-full bg-black/40 hover:bg-secondary transition-colors duration-300"
            >
              <FaTwitter size={25} />
            </a>
            <a
              href="#"
              className="text-xl p-3 rounded-full bg-black/40 hover:bg-secondary transition-colors duration-300"
            >
              <FaFacebook size={25} />
            </a>
            <a
              href="#"
              className="text-xl p-3 rounded-full bg-black/40 hover:bg-secondary transition-colors duration-300"
            >
              <FaInstagram size={25} />
            </a>
          </div>
        </div>

        {/* Opening Hours */}
        <div className="w-60">
          <div className=" text-2xl my-5">Opening Hours</div>
          <ul className=" text-md space-y-5 ">
            {[
              "Monday",
              "Tuesday",
              "Wednesday",
              "Thursday",
              "Friday",
              "Saturday",
              "Sunday",
            ].map((day) => (
              <li key={day} className="flex gap-2 items-center">
                <h1 className="text-secondary">{day}:</h1>{" "}
                <span className="text-foreground">08:00 - 22:00</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact Info */}
        <div className="w-60">
          <div className=" text-2xl my-5">Contact Information</div>
          <div className=" flex flex-col gap-2 text-md text-secondary ">
            <a
            className="hover:text-foreground transition-colors duration-300"
              href="https://www.google.com/maps?q=198+West+21th+Street,+New+York+NY+10016"
              target="_blank"
              rel="noopener noreferrer"
            >
              198 West 21th Street, Suite 721 New York NY 10016
            </a>

            <a className="hover:text-foreground transition-colors duration-300" href="tel:+1235235598">+1235 2355 98</a>

            <a className="hover:text-foreground transition-colors duration-300" href="mailto:info@yoursite.com">info@yoursite.com</a>
            <a className="hover:text-foreground transition-colors duration-300" href="mailto:tasty@email.com">tasty@email.com</a>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="copyrightcontainer text-center text-md mt-20 text-secondary">
        <span>Copyright ©2024 All rights reserved</span>
      </div>
    </footer>
  );
};

export default Footer;
