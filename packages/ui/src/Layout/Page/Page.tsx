import SiteHeader from './content/SiteHeader'
import { PageProps } from './types';
import './styles.scss';

const Page = ({title, children}: PageProps) => {
  return (
    <>
        <SiteHeader title={title} />
        <div className='page-content'>
            {children}
        </div>
    </>
  )
}

export default Page