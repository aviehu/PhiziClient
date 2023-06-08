import animationData from "../welcomAnim.json"
import Lottie from 'lottie-react'
import { Stack} from "@mui/material";
import title from "../welcomTitle.png"

export default function WelcomePage() {
    return (
        <div style={{ position: 'absolute', width: '100%', height: '80%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop:'5%'}}>
            <Stack spacing={-15} alignItems={'center'}>
                <img src={title} alt="title"/>
                    <Lottie
                        alignItems = {'center'}
                        animationData={animationData}
                        style={{height: '40%', width: '80%' }}
                    />    
            </Stack>
                
        </div>
            
    )
}