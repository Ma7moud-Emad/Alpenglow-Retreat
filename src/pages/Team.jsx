import { useState } from "react";
import styled from "styled-components";
import { HiOutlinePlus, HiOutlineTrash, HiOutlineUsers } from "react-icons/hi2";
import PageHeader from "../ui/PageHeader";
import Card from "../ui/Card";
import Button from "../ui/Button";
import Avatar from "../ui/Avatar";
import Badge from "../ui/Badge";
import DataTable, { Tbody, Td, Th, Thead, Tr } from "../ui/Table";
import { Select } from "../ui/Form";
import EmptyState from "../ui/EmptyState";
import ErrorState from "../ui/ErrorState";
import ConfirmDialog from "../ui/ConfirmDialog";
import { SkeletonTable } from "../ui/Skeleton";
import AddStaffForm from "../features/team/AddStaffForm";
import { useDeleteStaff, useSetStaffRole, useStaff } from "../hooks/useStaff";
import useAuth from "../hooks/useAuth";
import { formatDate } from "../lib/format";

const Person = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-3);

  & div {
    min-width: 0;
  }
  & strong {
    display: block;
    font-weight: 500;
    color: var(--text);
  }
  & small {
    font-size: var(--text-xs);
    color: var(--text-muted);
  }
`;

const RoleSelect = styled(Select)`
  width: auto;
  min-width: 12rem;
  padding-block: 0.5rem;
  font-size: var(--text-sm);
`;

export default function Team() {
  const { user } = useAuth();
  const [isAdding, setIsAdding] = useState(false);
  const [pendingRemoval, setPendingRemoval] = useState(null);

  const { data: team = [], isPending, error, refetch } = useStaff();
  const { mutate: setRole, isPending: isSettingRole } = useSetStaffRole();
  const { mutate: remove, isPending: isRemoving } = useDeleteStaff();

  const adminCount = team.filter((member) => member.role === "admin").length;

  return (
    <>
      <PageHeader
        title="Team"
        subtitle="Who can sign in, and what they are allowed to do"
      >
        <Button onClick={() => setIsAdding(true)}>
          <HiOutlinePlus /> Add member
        </Button>
      </PageHeader>

      <Card>
        {error ? (
          <ErrorState error={error} onRetry={refetch} />
        ) : isPending ? (
          <SkeletonTable rows={4} />
        ) : team.length === 0 ? (
          <EmptyState
            icon={<HiOutlineUsers />}
            title="No team members"
            description="Add the first account to give someone access."
          />
        ) : (
          <DataTable>
            <Thead>
              <Tr>
                <Th>Member</Th>
                <Th>Role</Th>
                <Th>Joined</Th>
                <Th />
              </Tr>
            </Thead>
            <Tbody>
              {team.map((member) => {
                const isSelf = member.id === user?.id;
                const isLastAdmin = member.role === "admin" && adminCount <= 1;

                return (
                  <Tr key={member.id}>
                    <Td data-label="Member">
                      <Person>
                        <Avatar
                          src={member.avatar_url}
                          name={member.full_name || member.email}
                        />
                        <div>
                          <strong>
                            {member.full_name || member.email}
                            {isSelf && " (you)"}
                          </strong>
                          <small>{member.email}</small>
                        </div>
                      </Person>
                    </Td>

                    <Td data-label="Role">
                      {isSelf || isLastAdmin ? (
                        <Badge $tone={member.role === "admin" ? "accent" : "neutral"}>
                          {member.role}
                        </Badge>
                      ) : (
                        <RoleSelect
                          value={member.role}
                          disabled={isSettingRole}
                          aria-label={`Role for ${member.full_name || member.email}`}
                          onChange={(event) =>
                            setRole({
                              userId: member.id,
                              role: event.target.value,
                            })
                          }
                        >
                          <option value="staff">Staff</option>
                          <option value="admin">Admin</option>
                        </RoleSelect>
                      )}
                    </Td>

                    <Td data-label="Joined">{formatDate(member.created_at)}</Td>

                    <Td $align="right">
                      {!isSelf && !isLastAdmin && (
                        <Button
                          variant="danger-soft"
                          size="sm"
                          onClick={() => setPendingRemoval(member)}
                        >
                          <HiOutlineTrash /> Remove
                        </Button>
                      )}
                    </Td>
                  </Tr>
                );
              })}
            </Tbody>
          </DataTable>
        )}
      </Card>

      <AddStaffForm isOpen={isAdding} onClose={() => setIsAdding(false)} />

      <ConfirmDialog
        isOpen={Boolean(pendingRemoval)}
        onClose={() => setPendingRemoval(null)}
        onConfirm={() =>
          remove(pendingRemoval.id, { onSuccess: () => setPendingRemoval(null) })
        }
        isLoading={isRemoving}
        title="Remove this team member?"
        message={`${
          pendingRemoval?.full_name || pendingRemoval?.email
        } will lose access immediately. Their account is deleted permanently.`}
        confirmLabel="Remove"
      />
    </>
  );
}
