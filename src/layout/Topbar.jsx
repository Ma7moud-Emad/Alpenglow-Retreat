import { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import {
  HiOutlineArrowRightOnRectangle,
  HiOutlineBars3,
  HiOutlineComputerDesktop,
  HiOutlineMoon,
  HiOutlineSun,
  HiOutlineUserCircle,
} from "react-icons/hi2";
import useAuth from "../hooks/useAuth";
import useTheme from "../hooks/useTheme";
import { signOut } from "../services/auth";
import notify from "../lib/toast";
import Avatar from "../ui/Avatar";
import Menu, { MenuItem } from "../ui/Menu";
import SegmentedControl from "../ui/SegmentedControl";

const Header = styled.header`
  grid-area: header;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-4);
  height: var(--topbar-height);
  padding: 0 var(--space-5);
  background-color: var(--surface);
  border-bottom: 1px solid var(--border);
  position: sticky;
  top: 0;
  z-index: 40;
`;

const Left = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-3);
  min-width: 0;
`;

const Right = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-3);
`;

const MenuToggle = styled.button`
  display: none;
  place-items: center;
  width: 4rem;
  height: 4rem;
  border-radius: var(--radius-sm);
  color: var(--text-secondary);

  &:hover {
    background-color: var(--surface-hover);
  }
  & svg {
    width: 2.2rem;
    height: 2.2rem;
  }

  @media (max-width: 900px) {
    display: grid;
  }
`;

const Identity = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-3);
`;

const Who = styled.div`
  display: none;
  flex-direction: column;
  line-height: 1.2;

  & strong {
    font-size: var(--text-sm);
    font-weight: 600;
  }
  & small {
    font-size: var(--text-xs);
    color: var(--text-muted);
    text-transform: capitalize;
  }

  @media (min-width: 640px) {
    display: flex;
  }
`;

/* Stays visible at every width. It used to be hidden below 560px, which was
   fine while the account menu carried a light/dark toggle; now that the toggle
   is gone this is the only theme control there is. */
const ThemeSwitch = styled.div`
  min-width: 0;
`;

const THEME_OPTIONS = [
  { value: "light", label: <HiOutlineSun aria-label="Light" /> },
  { value: "dark", label: <HiOutlineMoon aria-label="Dark" /> },
  { value: "system", label: <HiOutlineComputerDesktop aria-label="System" /> },
];

export default function Topbar({ onOpenSidebar }) {
  const { profile, user } = useAuth();
  const { mode, setMode } = useTheme();
  const navigate = useNavigate();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const { mutate: doSignOut } = useMutation({
    mutationFn: signOut,
    onMutate: () => setIsSigningOut(true),
    onSuccess: () => navigate("/signin", { replace: true }),
    onError: (error) => {
      setIsSigningOut(false);
      notify.error(error.message);
    },
  });

  const name = profile?.full_name || user?.email || "Account";

  return (
    <Header>
      <Left>
        <MenuToggle
          type="button"
          onClick={onOpenSidebar}
          aria-label="Open navigation menu"
        >
          <HiOutlineBars3 />
        </MenuToggle>
      </Left>

      <Right>
        <ThemeSwitch>
          <SegmentedControl
            label="Colour theme"
            options={THEME_OPTIONS}
            value={mode}
            onChange={setMode}
          />
        </ThemeSwitch>

        <Identity>
          <Avatar src={profile?.avatar_url} name={name} />
          <Who>
            <strong>{name}</strong>
            <small>{profile?.role ?? "staff"}</small>
          </Who>

          <Menu label="Account menu">
            <MenuItem
              icon={<HiOutlineUserCircle />}
              onClick={() => navigate("/admin/account")}
            >
              My account
            </MenuItem>
            <MenuItem
              icon={<HiOutlineArrowRightOnRectangle />}
              onClick={() => doSignOut()}
              disabled={isSigningOut}
              danger
            >
              {isSigningOut ? "Signing out…" : "Sign out"}
            </MenuItem>
          </Menu>
        </Identity>
      </Right>
    </Header>
  );
}
