export type LinkBlock = {
  title: string;
  url: string;
  id: string;
};

export enum SocialPlatforms {
  FACEBOOK = 'facebook',
  INSTAGRAM = 'instagram',
  LINKEDIN = 'linkedin',
  YOUTUBE = 'youtube',
  TWITTER = 'twitter',
  GITHUB = 'github',
}

export type SocialBlock = {
  platform: SocialPlatforms;
  url: string;
};

export type MetaBlock = {
  username: string;
  description: string;
  image: string;
  background: string;
  font: string;
};

export type Body = {
  meta: MetaBlock;
  socials: SocialBlock[];
  links: LinkBlock[];
};

const generateHead = ({
  username,
  description,
  font,
  background,
  image,
}: MetaBlock) =>
  `
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${username} | Ezly Profile</title>
  <meta name="description" content="${description}">
  <link rel="shortcut icon" href="${image}" type='image/png'>
  <script src="https://unpkg.com/feather-icons"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=${encodeURIComponent(
    font
  )}:wght@400;700&display=swap" rel="stylesheet">
  <style>
    *,
    *::after,
    *::before {
      margin: 0;
      padding: 0;
      font-family: ${font};
    }
    header {
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    body {
      background-color: ${background};
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 1.5rem;
      min-height: calc(100vh - 3rem);
    }
    div.container {
      width: 100%;
      max-width: 25rem;
      min-height: calc(100vh - 3rem);
      display: flex;
      flex-direction: column;
    }
    img#profile-image {
      display: block;
      border: none;
      border-radius: 50%;
      object-fit: cover;
      object-position: center;
      height: 8rem;
      width: 8rem;
    }
    h1#username {
      font-weight: bold;
      font-size: 1.25rem;
      margin-top: 1rem;
      text-align: center;
    }
    nav.socials-list {
      margin-top: 1rem;
      display: flex;
      justify-content: space-evenly;
      align-items: center;
      gap: 0.5rem;
      flex-wrap: wrap;
    }
    a.socials-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 0.5rem;
      border: none;
      border-radius: 0.5rem;
      background-color: white;
      color: black;
      border: 2px solid #222222;
      border-radius: 0.5rem;
    }
    a.socials-item > svg {
      height: 2rem;
      width: 2rem;
    }
    main.links-list {
      list-style: none;
      margin-top: 1rem;
    }
    a.links-item {
      display: block;
      padding: 0.5rem;
      margin-top: 1rem;
      background: white;
      border: 2px solid #222222;
      border-radius: 0.5rem;
      text-decoration: none;
      text-align: center;
      color: black;
      font-weight: bold;
    }
    footer {
      display: flex;
      justify-content: center;
      align-items: center;
      margin-top: auto;
    }
    footer > h2 {
      margin-left: 0.5rem;
      font-family: ${font};
      font-weight: bold;
    }
    @media only screen and (max-width: 600px) {
      a.socials-item > svg {
        height: 1.5rem;
        width: 1.5rem;
      }
    }
    @media only screen and (max-width: 400px) {
      a.socials-item > svg {
        height: 1.25rem;
        width: 1.25rem;
      }
    }
    body::-webkit-scrollbar {
      display: none;
    }
    body {
      -ms-overflow-style: none;
      scrollbar-width: none;
    }
  </style>
</head>
`.trim();

type generateHeaderArg = Pick<MetaBlock, 'username' | 'image'> & {
  socials: SocialBlock[];
};

const generateHeader = ({ username, image, socials }: generateHeaderArg) =>
  `
<header>
  <img id="profile-image" src="${image}" alt="${username} profile picture" />
  <h1 id="username">@${username}</h1>
  <nav class="socials-list">
    ${socials
      .map(({ url, platform }) =>
        `
      <a class="socials-item" href="${url}" target="_blank" rel="noopener noreferrer">
        <i
          width="2rem"
          height="2rem"
          fill="none"
          stroke="currentColor"
          stroke-width="0.125rem"
          stroke-linecap="round"
          stroke-linejoin="round"
          data-feather="${platform}">
        </i>
      </a>
    `.trim()
      )
      .reduce((acc, cur) => (acc = acc + cur), '')}
  </nav>
</header>
`.trim();

const renderHTML = ({ meta, links, socials }: Body): string =>
  `
<!DOCTYPE html>
<html lang="en" dir="ltr">
  ${generateHead(meta)}
<body>
  <div class="container">
    ${generateHeader({
      username: meta.username,
      image: meta.image,
      socials: socials,
    })}
    <main class="links-list">
      ${links
        .map(({ title, url }) =>
          `
        <a class="links-item" href="${url}" target="_blank" rel="noopener noreferrer">
          ${title}
        </a>
      `.trim()
        )
        .reduce((acc, cur) => (acc = acc + cur), '')}
    </main>
    <footer>
      <svg xmlns="http://www.w3.org/2000/svg" width="1.75rem" height="1.75rem" fill="#000000" viewBox="0 0 256 256"><rect width="256" height="256" fill="none"></rect><circle cx="128" cy="68" r="40" fill="none" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"></circle><circle cx="188" cy="172" r="40" fill="none" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"></circle><circle cx="68" cy="172" r="40" fill="none" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"></circle></svg>
      <h2>EZLY</h2>
    </footer>
  </div>
  <script>feather.replace()</script>
</body>
</html>
`.trim();

export default renderHTML;
