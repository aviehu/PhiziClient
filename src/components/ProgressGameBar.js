import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';


export default function ProgressGameBar({activeStep,posesNames}) {
  return (
    <Box sx={{ width: '100%' }}>
      <Stepper activeStep={activeStep} >
        {posesNames.map((poseName) => (
          <Step key={poseName}>
            <StepLabel>{poseName}</StepLabel>
          </Step>
        ))}
      </Stepper>
    </Box>
  );
}