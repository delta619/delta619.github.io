// Skills icons - https://icon-sets.iconify.design/
import { Icon } from "@iconify/react";

// Navbar Logo image (uncomment below and import your image)
// import newLogo from "./images/yourFileName"

// Projects Images (add your images to the images directory and import below)
import Logo from "./images/logo.svg";

// Hero Images (add your images to the /images directory with the same names)
import HeroLight from "./images/hero-light.jpg";
import HeroDark from "./images/hero-dark.jpg";
// If you change the import names above then you need to change the export names below
export { HeroLight as Light };
export { HeroDark as Dark };

/* START HERE
 **************************************************************
  Add your GitHub username (string - "YourUsername") below.
*/
export const githubUsername = "delta619";

// Navbar Logo image
export const navLogo = undefined;

// Blog link icon - https://icon-sets.iconify.design/
export const Blog = <Icon icon="line-md:linkedin" />

/* About Me
 **************************************************************
  Add a second paragraph for the about me section.
*/
export const moreInfo =
  "I enjoy learning about technology and helping others use it to improve their lives and be more productive. I built this site with React, React Bootstrap, Redux, and the GitHub REST API.";

/* Skills
 ************************************************************** 
  Add or remove skills in the SAME format below, choose icons here - https://icon-sets.iconify.design/
*/
export const skillData = [
  {
    id: 1,
    skill: <Icon icon="fontisto:aws"  className="display-4" />,
    name: "AWS",
  },
  {
    id: 2,
    skill: <Icon icon="file-icons:serverless" className="display-4" />,
    name: "Serverless",
  },
  {
    id: 3,
    skill: <Icon icon="fa6-brands:golang"  className="display-4" />,
    name: "Golang",
  },
  {
    id: 4,
    skill: <Icon icon="teenyicons:javascript-solid"  className="display-4" />,
    name: "Javascript",
  },
  {
    id: 5,
    skill: <Icon icon="mdi:react" className="display-4" />,
    name: "React",
  },
  {
    id: 6,
    skill: <Icon icon="fontisto:sass"  className="display-4" />,
    name: "Styled Components",
  },
  {
    id: 7,
    skill: <Icon icon="typcn:html5"  className="display-4" />,
    name: "HTML5",
  },
  {
    id: 8,
    skill: <Icon icon="devicon-plain:django"  className="display-4" />,
    name: "Django",
  },
  {
    id: 9,
    skill: <Icon icon="devicon-plain:postgresql" className="display-4" />,
    name: "Postgres",
  },
];

// Resume link (string - "https://YourResumeUrl") - I am using CloudFront to share my resume (https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/Introduction.html)
export const resume = null;

/* Projects
 ************************************************************** 
  List the repo names (string - "your-repo-name") you want to include (they will be sorted alphabetically). If empty, only the first 3 will be included.
*/
export const filteredProjects = ["example-1", "example-2", "example-3"];

// Replace the defualt GitHub image for matching repos below (images imported above - lines 7-8)
export const projectCardImages = [
  {
    name: "example-1",
    image: Logo,
  },
];

/* Contact Info
 ************************************************************** 
  Add your formspree endpoint below.
  https://formspree.io/
*/
export const formspreeUrl = "https://formspree.io/f/YourEndpoint";
export const linkedinURL = "https://www.linkedin.com/in/ashutoshmalla";
