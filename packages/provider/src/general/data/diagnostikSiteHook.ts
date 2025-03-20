import axios from "axios";

export const diagnostikSiteHook = () =>
  axios({
    method: "post",
    url: "https://api.vercel.com/v1/integrations/deploy/prj_WeP3JC0klcE0sGNkeDcr6PYT8Jmn/whIoUQHJWd",
  });

export default diagnostikSiteHook;
