import { Loader, LoadingIndicator } from "@repo/ui"

export default function Loading() {
    console.log('Loading');
    
    // You can add any UI inside Loading, including a Skeleton.
    return (
    <div style={{position: 'fixed', width: '100vh', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
        <LoadingIndicator />
    </div>
    )
  }