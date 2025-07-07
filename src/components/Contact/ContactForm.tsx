import React from 'react'

function ContactForm() {
  return (
    <div className='w-full grid md:grid-cols-2 gap-10 md:px-10 py-10'>
      {/* Contact Information */}
      <div className='grid grid-cols-1 gap-5'>
        <div className='py-5'>
          <span className='text-accent text-2xl font-medium'>Contact Information</span>
        </div>
        <div className='p-5 border border-secondary/50'>
          <span className='text-secondary text-base'>
            Address: 198 West 21th Street, Suite 721 New York NY 10016
          </span>
        </div>
        <div className='p-5 border border-secondary/50'>
          <span className='text-secondary text-base'>
            Phone: <a className="text-theme" href="tel:+1235235598">+1235 2355 98</a>
          </span>
        </div>
        <div className='p-5 border border-secondary/50'>
          <span className='text-secondary text-base'>
            Email: <a className="text-theme" href="mailto:info@yoursite.com">info@yoursite.com</a>
          </span>
        </div>
        <div className='p-5 border border-secondary/50'>
          <span className='text-secondary text-base'>
            Website: <a className="text-theme" href="mailto:tasty@email.com">tasty@email.com</a>
          </span>
        </div>
      </div>

      {/* Contact Form */}
      <form className='w-full flex flex-col gap-5'>
        <input
          type="text"
          placeholder="Your Name"
          className="w-full border border-secondary/50 p-3 text-md focus:outline-none focus:border-theme placeholder:text-secondary text-accent"
        />
        <input
          type="email"
          placeholder="Your Email"
          className="w-full border border-secondary/50 p-3 text-md focus:outline-none focus:border-theme placeholder:text-secondary text-accent"
        />
        <input
          type="text"
          placeholder="Subject"
          className="w-full border border-secondary/50 p-3 text-md focus:outline-none focus:border-theme placeholder:text-secondary text-accent"
        />
        <textarea
          rows={5}
          placeholder="Message"
          className="w-full border border-secondary/50 p-3 text-md focus:outline-none focus:border-theme placeholder:text-secondary text-accent"
        ></textarea>
        <button
          type="submit"
          className="bg-theme border-2 border-theme hover:bg-transparent text-white hover:text-theme transition-all duration-300 cursor-pointer font-semibold py-3 px-6 w-fit"
        >
          Send Message
        </button>
      </form>
    </div>
  )
}

export default ContactForm;
