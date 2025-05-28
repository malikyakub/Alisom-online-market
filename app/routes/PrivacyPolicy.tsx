import React from "react";

export default function PrivacyPolicy() {
  return (
    <div className="p-4 md:p-8 text-gray-900 dark:text-white">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>

      <p className="mb-4">
        At our company, your privacy is important to us. This Privacy Policy
        explains how we collect, use, and protect your personal information when
        you use our website and services.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">
        Information We Collect
      </h2>
      <ul className="list-disc list-inside mb-4">
        <li>
          Personal information you provide when registering or contacting us
          (e.g., name, email, phone).
        </li>
        <li>
          Data automatically collected from your use of the website, like
          cookies and usage data.
        </li>
      </ul>

      <h2 className="text-2xl font-semibold mt-8 mb-4">
        How We Use Your Information
      </h2>
      <p className="mb-4">We use your information to:</p>
      <ul className="list-disc list-inside mb-4">
        <li>Provide and improve our products and services.</li>
        <li>Communicate with you about your account or support requests.</li>
        <li>
          Send you updates, promotional materials, and relevant offers (you can
          opt out anytime).
        </li>
      </ul>

      <h2 className="text-2xl font-semibold mt-8 mb-4">Data Security</h2>
      <p className="mb-4">
        We take reasonable measures to protect your personal data from
        unauthorized access, disclosure, or destruction. However, no method of
        transmission over the internet is completely secure.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">Your Rights</h2>
      <p className="mb-4">
        You can review, update, or delete your personal information by
        contacting us. You can also unsubscribe from marketing communications at
        any time.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">Third-Party Services</h2>
      <p className="mb-4">
        We may use trusted third-party services to support our operations (e.g.,
        hosting, analytics). These providers have their own privacy policies and
        are required to protect your data.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">
        Changes to This Policy
      </h2>
      <p className="mb-4">
        We may update this Privacy Policy from time to time. We encourage you to
        review this page periodically for any changes.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">Contact Us</h2>
      <p>
        If you have any questions or concerns about this Privacy Policy, please
        contact us at:{" "}
        <a
          href="mailto:malikyakub@hotmail.com"
          className="text-blue-600 hover:underline"
        >
          malikyakub@hotmail.com
        </a>
      </p>
    </div>
  );
}
