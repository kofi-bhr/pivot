import Layout from '@/components/layout/Layout';

export default function GetInvolved() {
  return (
    <Layout>
      <div className="bg-white">
        <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-2xl lg:mx-0">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Join</h2>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Join PIVOT as a writer or fellow and help shape policy discussions.
            </p>
          </div>
          
          <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-12 sm:gap-y-16 lg:mx-0 lg:max-w-none lg:grid-cols-2">
            <div className="border border-gray-200 rounded-lg p-8 hover:border-gray-300 transition-colors">
              <h3 className="text-2xl font-bold tracking-tight text-gray-900">Writers</h3>
              <p className="mt-4 text-base leading-7 text-gray-600">
                Share your perspectives on pressing policy issues through op-eds, articles, and research papers. Join PIVOT Voices and make your voice heard in the policy conversation.
              </p>
              <div className="mt-8">
                <a
                  href="https://forms.gle/VHDtEzJgNPLGNZiL9"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-md bg-blue-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                >
                  Apply as Writer
                </a>
              </div>
            </div>

            <div className="border border-gray-200 rounded-lg p-8 hover:border-gray-300 transition-colors">
              <h3 className="text-2xl font-bold tracking-tight text-gray-900">Fellows</h3>
              <p className="mt-4 text-base leading-7 text-gray-600">
                Design original, solutions-focused policy briefs and develop the skills to share your ideas with real-world changemakers through our fellowship program.
              </p>
              <div className="mt-8">
                <a
                  href="https://docs.google.com/forms/d/e/1FAIpQLSeYXwnrkO2yKZaXBiyoX4ZBvOxXtTOj3EHXhe4XSgp2UrxrSw/viewform"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-md bg-blue-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                >
                  Apply as Fellow
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
