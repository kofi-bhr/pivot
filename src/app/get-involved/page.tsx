'use client';

import Layout from '@/components/layout/Layout';

export default function GetInvolvedPage() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-12 text-center">Get Involved</h1>

          {/* Staff Writer Section */}
          <section id="staff-writer" className="mb-16">
            <div className="bg-white rounded-lg p-8 shadow-md">
              <h2 className="text-3xl font-bold mb-6">Become a Staff Writer</h2>
              <p className="text-gray-600 mb-6">
                Join our team of dedicated writers and contribute to shaping policy discussions through well-researched articles and analysis.
              </p>

              <h3 className="text-xl font-semibold mb-4">Benefits</h3>
              <ul className="list-disc list-inside mb-6 text-gray-600">
                <li>Work with experienced policy professionals</li>
                <li>Develop your research and writing skills</li>
                <li>Build a portfolio of published policy articles</li>
                <li>Network with policy experts and thought leaders</li>
                <li>Receive mentorship from senior staff members</li>
              </ul>

              <a
                href="https://commoninja.site/7f9de57f-9efb-41d3-b0dc-3a6e4bc240c8"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Apply Now
              </a>
            </div>
          </section>

          {/* Fellowship Section */}
          <section id="fellowship" className="mb-16">
            <div className="bg-white rounded-lg p-8 shadow-md">
              <h2 className="text-3xl font-bold mb-6">PIVOT Fellowship</h2>
              <p className="text-gray-600 mb-6">
                Our fellowship program offers a unique opportunity to work directly on policy research and advocacy while receiving mentorship from experienced professionals.
              </p>

              <h3 className="text-xl font-semibold mb-4">Program Benefits</h3>
              <ul className="list-disc list-inside mb-6 text-gray-600">
                <li>Hands-on policy research experience</li>
                <li>Mentorship from policy experts</li>
                <li>Networking opportunities</li>
                <li>Professional development workshops</li>
                <li>Stipend for program duration</li>
              </ul>

              <a
                href="https://commoninja.site/7f9de57f-9efb-41d3-b0dc-3a6e4bc240c8"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Apply for Fellowship
              </a>
            </div>
          </section>

          {/* FAQ Section */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-8">Frequently Asked Questions</h2>
            <div className="space-y-6">
              <div className="bg-white rounded-lg p-6 shadow-md">
                <h3 className="text-xl font-semibold mb-3">What are the time commitments?</h3>
                <p className="text-gray-600">
                  Staff Writers are expected to contribute at least one article per month. Fellows commit to 15-20 hours per week for the duration of the program.
                </p>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-md">
                <h3 className="text-xl font-semibold mb-3">What qualifications do I need?</h3>
                <p className="text-gray-600">
                  We value diverse perspectives and backgrounds. Strong writing skills and a passion for policy analysis are essential. Academic or professional experience in policy-related fields is a plus.
                </p>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-md">
                <h3 className="text-xl font-semibold mb-3">Is this a paid opportunity?</h3>
                <p className="text-gray-600">
                  Fellows receive a stipend for the duration of the program. Staff Writers are compensated per published article.
                </p>
              </div>
            </div>
          </section>

          {/* Contact Section */}
          <section>
            <div className="bg-white rounded-lg p-8 shadow-md text-center">
              <h2 className="text-3xl font-bold mb-4">Have More Questions?</h2>
              <p className="text-gray-600 mb-4">
                Let&apos;s shape the future of policy together. Join our community of passionate writers and analysts making a difference.
              </p>
              <a
                href="mailto:contact@pivot.org"
                className="text-blue-600 font-semibold hover:text-blue-700"
              >
                contact@pivot.org
              </a>
            </div>
          </section>
        </div>
      </div>
    </Layout>
  );
}
