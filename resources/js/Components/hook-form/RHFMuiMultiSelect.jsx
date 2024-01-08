import PropTypes from "prop-types";
// form
import { useFormContext, Controller } from "react-hook-form";
// @mui
import {
    FormControl,
    FormHelperText,
    InputLabel,
    MenuItem,
    Select,
    Stack,
    Checkbox,
    ListItemText
} from "@mui/material";

// ----------------------------------------------------------------------

RHFMuiMultiSelect.propTypes = {
    name: PropTypes.string,
};

export default function RHFMuiMultiSelect({
    name,
    label = "",
    options = [],
    selectProp = {},
    ...other
}) {
    const { control, setValue } = useFormContext();

    const handleChange = (event) => {
      const {
        target: { value },
      } = event;
      // console.log(value);
      setValue(name,
        // On autofill we get a stringified value.
        typeof value === 'string' ? value : value.join(','),
      );
    };

    return (
        <Controller
            name={name}
            control={control}
            render={({ field, fieldState: { error } }) => (
              <Stack sx={{ width: 1 }}>
                  <FormControl error={!!error} {...other}>
                      <InputLabel id={`select-${label}`}>{label}</InputLabel>
                      <Select
                          labelId={`select-${label}`}
                          id={`select-${label}`}
                          label={label}
                          multiple
                          {...selectProp}
                          {...field}
                          value={!!field.value ? field.value.split(",") : []}
                          renderValue={(selected) => selected.join(', ')}
                          onChange={handleChange}
                      >
                          {options.map((opt, idx) => (
                              <MenuItem
                                  disabled={!!opt?.disabled}
                                  sx={{ height: 36 }}
                                  key={idx}
                                  value={opt.value || ""}
                              >
                                <Checkbox checked={(field.value?.split(",") || []).indexOf(opt?.value) > -1} />
                                <ListItemText primary={opt?.label} />
                              </MenuItem>
                          ))}
                      </Select>
                  </FormControl>
                  {!!error && (
                      <FormHelperText error sx={{ paddingLeft: 1.5 }}>
                          {error?.message}
                      </FormHelperText>
                  )}
              </Stack>
          )}
        />
    );
}
