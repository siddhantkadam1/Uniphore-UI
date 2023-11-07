import * as React from 'react';
import PropTypes from 'prop-types'; 
import Dialog from '@mui/material/Dialog'; 
import { useAdminDialog } from '../../context/adminDialogContext';
import { useDialogData } from '../../context/dialogDataContext';
import './dialog.css'

const emails = ['username@gmail.com', 'user02@gmail.com','user02@gmail.com',];

function SimpleDialog(props) {
  const {   setDialogFlag } = useAdminDialog();
  const { onClose, selectedValue, open } = props;
  const {dialogData} = useDialogData();

  const handleClose = () => {
    onClose(selectedValue);
  }; 

  const closeDialog = ()=>{
    setDialogFlag(false);
  }

  return (
    <Dialog onClose={handleClose} open={open}>
      <div className="admin-dialog-wrapper">
       <div className="dialog-cancel" onClick={closeDialog}>X</div>
      <div style={{width:'300px',padding:'10px',maxHeight:'200px',overflowY:'scroll'}}>
      <div className="admin-dialog-title" style={{margin:'8px',color:'#012148'}}>Admins</div>
       {
         dialogData.map((admin,index)=>{
           return <div className='admin-list-item' style={{margin:'8px'}} key={index}> {admin}</div>
          })
        }
        </div>
        </div>
    </Dialog>
  );
}

SimpleDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  selectedValue: PropTypes.string.isRequired,
};



export default function AdminDialog() {
  const { dialogFlag, setDialogFlag } = useAdminDialog();
  const [selectedValue, setSelectedValue] = React.useState(emails[1]);

  const handleClose = (value) => {
    setDialogFlag(false);
    setSelectedValue(value);
  };

  return (
    <div>
      <SimpleDialog
        selectedValue={selectedValue}
        open={dialogFlag}
        onClose={handleClose}
      />
    </div>
  );
}
