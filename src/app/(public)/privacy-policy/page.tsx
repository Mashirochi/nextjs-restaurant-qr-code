import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-lg text-muted-foreground">Last updated: 12/2025</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Introduction</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p>
              We respect your privacy and are committed to protecting your
              personal data. This privacy policy explains how we collect, use,
              and safeguard your information when you visit our website or use
              our services.
            </p>

            <h2 className="text-xl font-semibold mt-8">
              Information We Collect
            </h2>
            <p>
              We may collect, use, store and transfer different kinds of
              personal data about you which we have grouped together as follows:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Identity Data</strong> including first name, last name,
                username or similar identifier
              </li>
              <li>
                <strong>Contact Data</strong> including billing address,
                delivery address, email address and telephone numbers
              </li>
              <li>
                <strong>Financial Data</strong> including bank account and
                payment card details
              </li>
              <li>
                <strong>Transaction Data</strong> including details about
                payments to and from you and other details of products and
                services you have purchased from us
              </li>
              <li>
                <strong>Technical Data</strong> including internet protocol (IP)
                address, your login data, browser type and version, time zone
                setting and location, browser plug-in types and versions,
                operating system and platform and other technology on the
                devices you use to access this website
              </li>
              <li>
                <strong>Profile Data</strong> including your username and
                password, purchases or orders made by you, your interests,
                preferences, feedback and survey responses
              </li>
              <li>
                <strong>Usage Data</strong> including information about how you
                use our website, products and services
              </li>
              <li>
                <strong>Marketing and Communications Data</strong> including
                your preferences in receiving marketing from us and our third
                parties and your communication preferences
              </li>
            </ul>

            <h2 className="text-xl font-semibold mt-8">
              How We Use Your Information
            </h2>
            <p>
              We will only use your personal data when the law allows us to.
              Most commonly, we will use your personal data in the following
              circumstances:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                Where we need to perform the contract we are about to enter into
                or have entered into with you
              </li>
              <li>
                Where we need to comply with a legal or regulatory obligation
              </li>
              <li>
                Where it is necessary for our legitimate interests (or those of
                a third party) and your interests and fundamental rights do not
                override those interests
              </li>
              <li>Where we have your consent to do so</li>
            </ul>

            <h2 className="text-xl font-semibold mt-8">Cookies</h2>
            <p>
              We use cookies and similar tracking technologies to track the
              activity on our Service and store certain information. Cookies are
              files with small amount of data which may include an anonymous
              unique identifier.
            </p>

            <h2 className="text-xl font-semibold mt-8">Data Security</h2>
            <p>
              We have put in place appropriate security measures to prevent your
              personal data from being accidentally lost, used or accessed in an
              unauthorized way, altered or disclosed.
            </p>

            <h2 className="text-xl font-semibold mt-8">Data Retention</h2>
            <p>
              We will only retain your personal data for as long as necessary to
              fulfil the purposes we collected it for, including for the
              purposes of satisfying any legal, accounting, or reporting
              requirements.
            </p>

            <h2 className="text-xl font-semibold mt-8">Your Legal Rights</h2>
            <p>
              Under certain circumstances, you have rights under data protection
              laws in relation to your personal data, including the right to
              request access, correction, erasure, restriction, transfer, or to
              object to processing.
            </p>

            <h2 className="text-xl font-semibold mt-8">Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please
              contact us at:
            </p>
            <p className="mt-2">
              Email: privacy@restaurant.com
              <br />
              Phone: +1 (555) 123-4567
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
