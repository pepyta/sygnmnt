import { FormControl, InputLabel, MenuItem, Select, SelectProps } from "@mui/material";
import { ProgrammingLanguage } from "@prisma/client";

export type ProgrammingLanugageSelectProps = SelectProps<ProgrammingLanguage>;

const ProgrammingLanugageSelect = (props: ProgrammingLanugageSelectProps) => {
    const label = "Programming language";


    return (
        <FormControl fullWidth required>
            <InputLabel id="programming-language-select-label">{label}</InputLabel>
            <Select
                labelId="programming-language-select-label"
                label={label}
                {...props}
            >
                <MenuItem value={"C"}>C</MenuItem>
                <MenuItem value={"CPP"}>C++</MenuItem>
            </Select>
        </FormControl>
    );
};

export default ProgrammingLanugageSelect;