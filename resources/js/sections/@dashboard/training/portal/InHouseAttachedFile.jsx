import React from 'react';
import Scrollbar from '@/Components/scrollbar/Scrollbar'
import FileLinkThumbnail from '@/Components/upload/preview/FileLinkThumbnail'
import { Dialog, DialogContent, DialogTitle, Portal, Table, TableBody, TableCell, TableContainer, TableRow } from '@mui/material'

function InHouseAttachedFile({ open, onClose, training, ...other }) {
  
  return (
    <Portal>
      <Dialog fullWidth maxWidth="lg" open={open} onClose={onClose} {...other}>
        <DialogTitle sx={{ p: (theme) => theme.spacing(3, 3, 2, 3) }}>Attached File</DialogTitle>
        <DialogContent dividers sx={{ pt: 1, pb: 0, border: 'none' }}>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Scrollbar>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell align="left">
                      {training?.attached_file && <FileLinkThumbnail file={training.attached_file} />}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Scrollbar>
          </TableContainer>
        </DialogContent>
      </Dialog>
    </Portal>
  )
}

export default InHouseAttachedFile