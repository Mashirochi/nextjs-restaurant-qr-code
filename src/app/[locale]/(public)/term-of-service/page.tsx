import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function TermsOfServicePage() {
  return (
    <div className="container mx-auto py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Terms of Service</h1>
          <p className="text-lg text-muted-foreground">Last updated: 12/2025</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Introduction</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p>
              Welcome to our restaurant services. These terms of service
              (&quot;Terms&quot;) govern your access to and use of our website,
              mobile applications, and related services (collectively, the
              &quot;Services&quot;).
            </p>
            <p>
              By accessing or using our Services, you agree to be bound by these
              Terms and all applicable laws and regulations. If you do not agree
              with any part of these Terms, you must not use our Services.
            </p>

            <h2 className="text-xl font-semibold mt-8">Use of Services</h2>
            <p>
              You agree to use our Services only for lawful purposes and in
              accordance with these Terms. You agree not to:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Violate any applicable laws or regulations</li>
              <li>Infringe upon the rights of others</li>
              <li>
                Transmit any material that is harmful, offensive, or otherwise
                objectionable
              </li>
              <li>
                Attempt to gain unauthorized access to our systems or networks
              </li>
              <li>Interfere with the proper functioning of our Services</li>
            </ul>

            <h2 className="text-xl font-semibold mt-8">Accounts</h2>
            <p>
              When you create an account with us, you must provide accurate and
              complete information. You are responsible for maintaining the
              confidentiality of your account and password and for restricting
              access to your computer or device.
            </p>

            <h2 className="text-xl font-semibold mt-8">Orders and Payments</h2>
            <p>
              By placing an order through our Services, you are making an offer
              to purchase the selected items. All orders are subject to
              acceptance by us, and we reserve the right to refuse any order for
              any reason.
            </p>
            <p>
              You agree to pay all charges incurred by your account, including
              applicable taxes. We may automatically charge your selected
              payment method for orders placed through our Services.
            </p>

            <h2 className="text-xl font-semibold mt-8">
              Intellectual Property
            </h2>
            <p>
              All content included in or made available through our Services,
              such as text, graphics, logos, images, audio clips, digital
              downloads, data compilations, and software, is the property of our
              restaurant or its licensors and protected by copyright and other
              intellectual property laws.
            </p>

            <h2 className="text-xl font-semibold mt-8">
              Limitation of Liability
            </h2>
            <p>
              To the fullest extent permitted by law, our restaurant shall not
              be liable for any indirect, incidental, special, consequential or
              punitive damages, including without limitation, loss of profits,
              data, use, goodwill, or other intangible losses, resulting from:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                Your access to or use of or inability to access or use the
                Services
              </li>
              <li>Any conduct or content of any third party on the Services</li>
              <li>Any content obtained from the Services</li>
              <li>
                Unauthorized access, use or alteration of your transmissions or
                content
              </li>
            </ul>

            <h2 className="text-xl font-semibold mt-8">
              Modifications to Services
            </h2>
            <p>
              We reserve the right to modify, suspend, or discontinue our
              Services at any time without notice. We shall not be liable to you
              or any third party for any modification, suspension, or
              discontinuance of the Services.
            </p>

            <h2 className="text-xl font-semibold mt-8">Governing Law</h2>
            <p>
              These Terms shall be governed and construed in accordance with the
              laws of [Your Jurisdiction], without regard to its conflict of law
              provisions.
            </p>

            <h2 className="text-xl font-semibold mt-8">Changes to Terms</h2>
            <p>
              We reserve the right, at our sole discretion, to modify or replace
              these Terms at any time. If a revision is material, we will
              provide at least 30 days&apos; notice prior to any new terms
              taking effect.
            </p>

            <h2 className="text-xl font-semibold mt-8">Contact Us</h2>
            <p>
              If you have any questions about these Terms, please contact us at:
            </p>
            <p className="mt-2">
              Email: terms@restaurant.com
              <br />
              Phone: +1 (555) 123-4567
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
