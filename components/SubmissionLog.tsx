import { ExpandMoreRounded as ExpandMoreIcon } from "@mui/icons-material";
import { Accordion, AccordionDetails, AccordionProps, AccordionSummary, Grid, Typography, useTheme } from "@mui/material";
import * as Prisma from "@prisma/client";
import { ExtendedSubmissionType } from "@redux/slices/membership";
import { useMemo } from "react";
import "@uiw/react-textarea-code-editor/dist.css";
import dynamic from "next/dynamic";

const CodeEditor = dynamic(
    () => import("@uiw/react-textarea-code-editor").then((mod) => mod.default),
    { ssr: false }
);

export type SubmissionLogProps = {
    submission: ExtendedSubmissionType;
}

const SubmissionLog = ({ submission, ...props }: SubmissionLogProps) => {
    const theme = useTheme();

    const sections = useMemo(
        () => {
            const title: Record<Prisma.LogStatus, string> = {
                "BUILDING": "Building",
                "RUNNING": "Running",
            };

            const statuses: Prisma.LogStatus[] = ["BUILDING", "RUNNING"];

            const map: Map<Prisma.LogStatus, Prisma.Log[]> = new Map();
            statuses.forEach((status) => map.set(status, []))

            for (const log of submission.logs) {
                const arr = map.get(log.status);
                arr.push(log);
            }

            statuses.forEach((status) => map.get(status).sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()));

            return statuses.map((status) => ({
                title: title[status],
                logs: map.get(status),
            }));
        },
        [submission.logs],
    );


    return (
        <>
            {sections.map((section) => (
                <Accordion key={`submission-log-section-${section}`} disabled={submission.logs.length === 0}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography>{section.title}</Typography>
                    </AccordionSummary>
                    <AccordionDetails sx={{ overflowX: "auto" }}>
                        <Grid container sx={{
                            ...theme.typography.body2,
                            fontFamily: 'ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace',
                        }}>
                            {section.logs.map((log) => (
                                <Grid item xs={12} key={`log-entry-${log.id}`}>
                                    <Grid container spacing={1}>
                                        <Grid item xs={3}>
                                            {`${new Date(log.createdAt).toLocaleDateString()} ${new Date(log.createdAt).toLocaleTimeString()}`}
                                        </Grid>
                                        <Grid item xs={9}>
                                            {log.content}
                                        </Grid>
                                    </Grid>
                                </Grid>
                            ))}
                        </Grid>
                    </AccordionDetails>
                </Accordion>
            ))}
        </>
    );
};

export default SubmissionLog;