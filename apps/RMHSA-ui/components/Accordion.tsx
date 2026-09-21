interface AccordionProps {
  openAccordionId: number | null;
  toggleAccordion: (id: number) => void;
}

const Accordion = ({ openAccordionId, toggleAccordion }: AccordionProps) => {
  const accordions = [
    {
      id: 1,
      buttonText: "Student Scholarships",
      content:
        "By providing scholarships, we empower talented students from diverse backgrounds to realize their full potential. Your donation will help ensure that financial constraints do not hinder academic aspirations.",
    },
    {
      id: 2,
      buttonText: "Pioneering Intellectual Innovation",
      // buttonText: "Pioneering Intellectual Brilliance/ Educational Innovation",
      content:
        "By supporting Rosa Mystica, you contribute to the cultivation of intellectual eminence. Your donation will facilitate the acquisition of cutting-edge resources, the recruitment of distinguished faculty, and the implementation of innovative pedagogical approaches",
    },
    {
      id: 3,
      buttonText: "Fostering a Dynamic Ecosystem",
      content: `Your support will nourish a dynamic ecosystem where intellectual curiosity flourishes, creativity thrives, and collaboration reigns supreme. From stimulating academic discourse to vibrant <b> extracurricular activities </b>, your donation will enrich every facet of student life.`,
    },
    {
      id: 4,
      buttonText: "Elevating Campus Infrastructure",
      content:
        "Rosa Mystica is committed to enhancing the campus infrastructure, your donation facilitates us to build more structures and improve the current state-of-the art that inspires learning and foster a sense of community. Our objective is to provide an environment that enables our future leaders maximize their potentials without hinderance.",
    },
    {
      id: 5,
      buttonText: "Emergency Fund",
      content:
        "Unforeseen circumstances can disrupt the educational journey of our students. Your generous donation to our Emergency Fund will provide critical support to students facing unexpected challenges, ensuring they can continue their studies uninterrupted. Whether it's a sudden illness, a natural disaster, or a personal tragedy, your contribution makes a tangible difference for the students and the school.",
    },
  ];

  return (
    <div>
      {accordions.map((accordion) => (
        <div key={accordion.id} className="py-3">
          <button
            className="flex gap-4 justify-between text-primary"
            onClick={() => toggleAccordion(accordion.id)} // Call toggle function on button click
          >
            {accordion.id === openAccordionId ? (
              <span>-</span>
            ) : (
              <span> +</span>
            )}
            <span>{accordion.buttonText}</span>
          </button>
          <div
            style={{
              maxHeight: accordion.id === openAccordionId ? "300px" : "0",
            }}
            className="text-slate-400 overflow-hidden transition-all duration-300"
          >
            {accordion.id === openAccordionId && (
              <div className="pl-6 leading-7">{accordion.content}</div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Accordion;
