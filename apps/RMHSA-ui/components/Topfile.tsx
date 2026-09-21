import Link from "next/link";

function Topfile() {
  return (
    <div>
      <div className="bg-[#F8941C] p-10 h-20 w-full flex items-center text-white justify-between max-lg:hidden">
        <div className="flex gap-8 content-center justify-center">
          <span className="flex gap-4 items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="#FFFFFF"
              className="bi bi-envelope-open"
              viewBox="0 0 16 16"
            >
              <path d="M8.47 1.318a1 1 0 0 0-.94 0l-6 3.2A1 1 0 0 0 1 5.4v.818l5.724 3.465L8 8.917l1.276.766L15 6.218V5.4a1 1 0 0 0-.53-.882l-6-3.2zM15 7.388l-4.754 2.877L15 13.117v-5.73zm-.035 6.874L8 10.083l-6.965 4.18A1 1 0 0 0 2 15h12a1 1 0 0 0 .965-.738zM1 13.117l4.754-2.852L1 7.387v5.73zM7.059.435a2 2 0 0 1 1.882 0l6 3.2A2 2 0 0 1 16 5.4V14a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V5.4a2 2 0 0 1 1.059-1.765l6-3.2z" />
            </svg>
            <p>rosamysticahsa@gmail.com</p>
          </span>

          <span className="flex gap-4 items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="#FFFFFF"
              className="bi bi-telephone-fill"
              viewBox="0 0 16 16"
            >
              <path
                fillRule="evenodd"
                d="M1.885.511a1.745 1.745 0 0 1 2.61.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.678.678 0 0 0 .178.643l2.457 2.457a.678.678 0 0 0 .644.178l2.189-.547a1.745 1.745 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.634 18.634 0 0 1-7.01-4.42 18.634 18.634 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877L1.885.511z"
              />
            </svg>
            <p>+234-8065133300 +234-8037647331 +234-8076367903</p>
          </span>
        </div>
        <div className="flex gap-6 items-center">
          <Link
            href={`https://wa.me/+1(347)440-9767?text=${encodeURIComponent(
              "Hello, I'm reaching out as an alumna of Rosa Mystica High School.\n\n" +
                "Name: \n" +
                "Class set of: \n" +
                "Our Class President's Name: \n\n" +
                "I would like to connect with the RMHS alumnae group.",
            )}`}
          >
            <span>Alumnae</span>
          </Link>
          <a href="/PDF/THIRD TERM CALENDAR FOR 2026.pdf" target="_blank">
            Calendar
          </a>
          <Link href="https://portal.rmhsagulu.com.ng/resultchecker.aspx">
            Portal
          </Link>
          <Link href="/give-to-RMHS">
            <span className="border border-white p-4 rounded-lg">
              Support RMHS
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Topfile;
