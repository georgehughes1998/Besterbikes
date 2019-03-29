# reservationHandling
The components in this folder are for use in the flow of reserving a bike

## DateAndTime
This component is the second step of the reserve flow using ReservationHandlingForm and the wizard

## Payment
This component is the fourth and final step of the reserve flow using ReservationHandlingForm and the wizard

## ReservationConfrimation
This component is the modal that appears at the end of the reserve flow to confirm to the user that their reservation has been completed

## ReservationHandlingForm
This component similar to that of AccountHandlingForm is responsible for displaying and handling the forms required for the reservation process and handling the objects and errors returned by firebase. 

The component uses redux forms to process the form and awaits a response from the reservation file which directly communicates with firebase 

## ReservationHandlingFormWizard
This component uses Redux form to provide a multi step form that stores values in redux ready to be submitted at the end of the flow

## ReserveBikeContainer
This component is the container that is loaded for the reservation page of the app and contains the reservation form

## ReviewOrder
This component is the third step of the reserve flow using ReservationHandlingForm and the wizard

## Selectbikes
This component is the first step of the reserve flow using ReservationHandlingForm and the wizard

## Steps
This component is for the UX and displays the status of each step in the flow updating depending on values in fields

## validate
Validation of fields in the reserve flow based on expected values