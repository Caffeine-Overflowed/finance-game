import { Dispatch, FC, SetStateAction } from "react";
import type { SortDescriptor } from "react-aria-components";
import { PlayerInfo } from "@/features/game/container/GameFinal";
import { Table, TableCard } from "@/shared/components/application/table/table";
import { Avatar } from "@/shared/components/base/avatar/avatar";
import { mod5 } from "@/shared/utils/mod5";

interface Props {
    sortedPlayers: PlayerInfo[];
    sortDescriptor: SortDescriptor;
    setSortDescriptor: Dispatch<SetStateAction<SortDescriptor>>;
}

export const FinalTable: FC<Props> = ({ sortedPlayers, sortDescriptor, setSortDescriptor }) => {
    return (
        <TableCard.Root className={"rounded-none"}>
            <Table aria-label="Team members" sortDescriptor={sortDescriptor} onSortChange={setSortDescriptor}>
                <Table.Header>
                    <Table.Head id="name" label="Name" isRowHeader className="w-full max-w-1/4" />
                    <Table.Head id="score" label="Score" tooltip="Score" />
                    <Table.Head id="money" label="Money" />
                </Table.Header>

                <Table.Body items={sortedPlayers}>
                    {(player) => (
                        <Table.Row id={player.name}>
                            <Table.Cell>
                                <div className="players-center flex gap-3">
                                    <Avatar src={`/avatar-${mod5(player.id) + 1}.png`} alt={player.name} size="md" />

                                    <div className="whitespace-nowrap items-center flex flex-row">
                                        <p className="whitespace-nowrap items-cents text-center align-middle text-sm font-medium text-primary">{player.name}</p>
                                    </div>
                                </div>
                            </Table.Cell>

                            <Table.Cell className="whitespace-nowrap">{player.score}</Table.Cell>

                            <Table.Cell className="whitespace-nowrap">{player.score * 100}</Table.Cell>
                        </Table.Row>
                    )}
                </Table.Body>
            </Table>
        </TableCard.Root>
    );
};
