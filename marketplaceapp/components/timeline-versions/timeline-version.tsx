import { Badge } from "@/components/ui/badge";
import {
    TimelineConnector,
    TimelineContent,
    TimelineIndicator,
    TimelineItem,
    TimelineRoot,
    TimelineSeparator,
    TimelineTitle,
} from "@/components/ui/timeline";
import { User, UserAvatar, UserName } from "../user/user";
import { JSX, ReactNode } from "react";

export type VersionEvent = {
    time: Date;
    action: string;
    state: string;
    user?: User;
};

export type VersionGroup = {
    id: string | number;
    name: string;

    events: VersionEvent[];
};

const lastItemClassNames = 'flex items-center gap-2 flex-wrap';

function TimelineVersionEvent({ itm, grp, previous, isLast }: { itm: VersionEvent, grp: VersionGroup, previous: VersionEvent | null, isLast: bool; }): ReactNode {
    return (
        < TimelineItem >
            <TimelineSeparator>
                <TimelineIndicator variant="solid">
                    <UserAvatar user={itm.user} />
                </TimelineIndicator>
                <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent>
                <TimelineTitle className={lastItemClassNames}>
                    <UserName user={itm.user} /> state <Badge>{itm.state}</Badge> version {grp.name ?? grp.id}
                </TimelineTitle>
            </TimelineContent>
        </TimelineItem >
    );
}

function TimelineVersionGroup({ grp }: { grp: VersionGroup; }): JSX.Element {

    return (
        <TimelineRoot>
            {grp.events.map((e, idx) => {
                const previous = idx > 0 ? grp.events[idx - 1] : null;
                const isLast = idx == grp.events.length - 1;

                return (<TimelineVersionEvent itm={e} grp={grp} previous={previous} isLast={isLast} key={idx} />);
            })}
        </TimelineRoot>
    );
}

export const dummyVersionsData: VersionGroup[] = [
    {
        id: 2,
        name: "Version 2",
        events: [
            {
                user: {
                    name: 'jesper',
                    userId: 'sitecore\\jba@asmblii.com'
                },
                action: 'save',
                state: 'submitted',
                time: new Date()
            },
            {
                user: {
                    name: 'jesper',
                    userId: 'sitecore\\jba@asmblii.com'
                },
                action: 'created',
                state: 'draft',
                time: new Date()
            }
        ]
    },
    {
        id: 1,
        name: "Version 1",
        events: [
            {
                user: {
                    name: 'jesper',
                    userId: 'sitecore\\jba@asmblii.com'
                },
                action: 'save',
                state: 'submitted',
                time: new Date()
            },
            {
                user: {
                    name: 'jesper',
                    userId: 'sitecore\\jba@asmblii.com'
                },
                action: 'created',
                state: 'draft',
                time: new Date()
            }
        ]
    }
];

export function TimelineVersions({ versions }: { versions: VersionGroup[]; }) {
    return (
        <div className="space-y-6">
            {versions.map(x => <TimelineVersionGroup grp={x} key={x.id} />)}
        </div>
    );
}
