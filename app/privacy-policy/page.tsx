import Link from 'next/link'

export const runtime = 'nodejs' // Mark as a server component

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-[#00B4D8] flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-4xl w-full">
        <h1 className="text-3xl font-bold mb-6 text-[#00B4D8]">Privacy Policy</h1>
        <div className="space-y-4 text-gray-700">
          <p className="text-sm text-gray-500">Last updated: November 14, 2024</p>
          
          <p>
            Welcome to Punderous™! At Punderous™, we value and respect your privacy. This Privacy Policy
            explains how we collect, use, and protect your information when you use our website and services.
            By using our website, you agree to the practices described in this Privacy Policy.
          </p>

          <h2 className="text-xl font-semibold text-[#00B4D8] mt-4">1. Information We Collect</h2>
          <p>We collect the following information:</p>
          <ul className="list-disc pl-5">
            <li>Email Address: We collect your email address when you provide it through our website for
            the purposes of gathering feedback about our game, sharing updates, and keeping you
            informed about related developments.</li>
            <li>Comments: We collect your feedback about our game.</li>
          </ul>

          <h2 className="text-xl font-semibold text-[#00B4D8] mt-4">2. How We Use Your Information</h2>
          <p>We use your email address solely for the following purposes:</p>
          <ul className="list-disc pl-5">
            <li>Communication: To send you updates about our game, announcements, news, promotional
            materials, and other information related to Punderous™.</li>
            <li>Feedback Collection: To gather information and feedback to improve our game and user
            experience.</li>
          </ul>
          <p>We do not sell or share your personal information with third parties for their own marketing
          purposes.</p>

          <h2 className="text-xl font-semibold text-[#00B4D8] mt-4">3. Legal Basis for Processing (For Users in the European Economic Area)</h2>
          <p>
            If you are located in the European Economic Area (EEA), our legal basis for collecting and using
            your personal information, as described above, depends on the personal information we collect and
            the specific context in which we collect it. We may process your personal information because:
          </p>
          <ul className="list-disc pl-5">
            <li>You have given us permission to do so</li>
            <li>We need to communicate with you about game updates and related information</li>
            <li>We have a legitimate interest in using your information to improve our services and engage
            with our user community</li>
          </ul>

          <h2 className="text-xl font-semibold text-[#00B4D8] mt-4">4. How We Protect Your Information</h2>
          <p>
            We take data protection and privacy seriously and use appropriate technical and organizational
            measures to protect your personal information from unauthorized access, use, or disclosure.
            However, no method of transmission over the Internet, or method of electronic storage, is entirely
            secure, so we cannot guarantee its absolute security.
          </p>

          <h2 className="text-xl font-semibold text-[#00B4D8] mt-4">5. Your Rights and Choices</h2>
          <p>Depending on your location, you may have certain rights regarding your personal information:</p>
          <ul className="list-disc pl-5">
            <li>Access: You can request a copy of the information we hold about you.</li>
            <li>Rectification: If your information is inaccurate or incomplete, you have the right to request a
            correction.</li>
            <li>Deletion: You may request that we delete your information. Note that we may retain certain
            data as required by law or for legitimate business purposes.</li>
            <li>Withdrawal of Consent: If we are processing your information based on your consent, you
            have the right to withdraw consent at any time.</li>
          </ul>
          <p>To exercise these rights, please contact us at punderousgame@gmail.com.</p>

          <h2 className="text-xl font-semibold text-[#00B4D8] mt-4">6. Data Retention</h2>
          <p>
            We will retain your email address for as long as necessary to fulfill the purposes outlined in this
            Privacy Policy, unless a longer retention period is required or permitted by law. If you request the
            deletion of your data, we will delete it in accordance with applicable laws and regulations.
          </p>

          <h2 className="text-xl font-semibold text-[#00B4D8] mt-4">7. International Transfers</h2>
          <p>
            Your information, including personal data, may be transferred to and maintained on computers
            located outside of your state, province, country, or other governmental jurisdiction, where data
            protection laws may differ from those in your jurisdiction. By submitting your email address to us, you
            consent to this transfer, storage, and processing.
          </p>
          <p>
            If you are located in the EEA, we will ensure that appropriate safeguards are in place to protect your
            data when it is transferred internationally, in compliance with GDPR requirements.
          </p>

          <h2 className="text-xl font-semibold text-[#00B4D8] mt-4">8. Compliance with the California Consumer Privacy Act (CCPA)</h2>
          <p>If you are a California resident, you have additional rights under the CCPA:</p>
          <ul className="list-disc pl-5">
            <li>Right to Know: You have the right to request information about the categories and specific
            pieces of personal information we have collected about you, as well as the sources of that
            information.</li>
            <li>Right to Delete: You have the right to request that we delete any personal information we
            have collected from you, subject to certain exceptions.</li>
            <li>Right to Non-Discrimination: We will not discriminate against you for exercising any of your
            CCPA rights.</li>
          </ul>
          <p>To make a request under CCPA, please contact us at punderousgame@gmail.com.</p>

          <h2 className="text-xl font-semibold text-[#00B4D8] mt-4">9. Third-Party Links</h2>
          <p>
            Our website may contain links to third-party websites. This Privacy Policy does not apply to those
            third-party websites, and we encourage you to review the privacy policies of any third-party websites
            you visit.
          </p>

          <h2 className="text-xl font-semibold text-[#00B4D8] mt-4">10. Changes to This Privacy Policy</h2>
          <p>
            We may update our Privacy Policy from time to time. Any changes will be posted on this page with
            an updated "Last Updated" date. We encourage you to review this Privacy Policy periodically for any
            changes.
          </p>

          <h2 className="text-xl font-semibold text-[#00B4D8] mt-4">11. Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, your rights, or our data practices, please contact
            us at:
          </p>
          <p>Email: playpunderous@gmail.com</p>

          <p className="mt-4">
            Thank you for being a part of Punderous™. We appreciate your trust and are committed to
            protecting your privacy.
          </p>
        </div>
        <div className="mt-8">
          <Link href="/" className="text-[#00B4D8] hover:underline">
            Return to Game
          </Link>
        </div>
      </div>
    </div>
  )
}