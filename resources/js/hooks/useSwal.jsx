import { useTheme } from '@mui/material';
import Swal from 'sweetalert2';

export function useSwal () {
	const { palette } = useTheme();

	function load (title = "", html = "") {
		Swal.fire({
			title,
			html,
			background: palette.mode === "dark" ? "#212B36" : "#fff",
			color: palette.mode === "dark" ? "#fff" : "#212B36",
			allowOutsideClick: false,
			timerProgressBar: true,
			showConfirmButton: false,
			didOpen: () => Swal.showLoading()
		});
	}

	function warning (title = "", text = "", confirmText = 'Yes, delete it!', options = {}) {
		return Swal.fire({
			title: title,
			text: text,
			type: 'warning',
			showCancelButton: true,
			customClass: {
				confirmButton: 'btn btn-alt-danger m-1',
				cancelButton: 'btn btn-alt-secondary m-1'
			},
			confirmButtonText: confirmText,
			...options
		})
	}

	return { load, stop: Swal.close, warning };
}