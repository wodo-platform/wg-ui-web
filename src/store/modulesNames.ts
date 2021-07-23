interface IModulesNames {
  user: string;
  article: string;
  profile: string;
  tags: string;
  wallet: string;
}

const modulesNames: Readonly<IModulesNames> = {
  user: "user",
  article: "article",
  profile: "profile",
  tags: "tags",
  wallet: "wallet"
};

export default modulesNames;
