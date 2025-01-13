import axios from 'axios';

export const vercelHook = () => axios({
	method: 'post',
	url:'https://api.vercel.com/v1/integrations/deploy/prj_eHuY9gP2Pdw4u0Ba2k9Se3ODvZXr/B8x0SfVdpf'
});

export default vercelHook;