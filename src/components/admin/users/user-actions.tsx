"use client";

import {
  fetchUserData as fetchUserDataAction,
  switchIsAdmin as switchIsAdminAction,
} from "@/src/lib/actions/usersActions";
import { User } from "@/src/lib/models/User";
import { ArrowDownOnSquareIcon, TrashIcon } from "@heroicons/react/16/solid";

export default function UserActions({
  user,
  loadUsers,
}: {
  user: User;
  loadUsers: Function;
}) {
  function fetchUserData() {
    fetchUserDataAction(user.id).then(() => {
      loadUsers();
    });
  }

  function switchIsAdmin() {
    switchIsAdminAction(user.id).then(() => {
      loadUsers();
    });
  }

  return (
    <div className="flex flex-col">
      <button
        className="rounded-lg p-1 bg-orange-500 hover:bg-sky-800 text-white mb-2"
        onClick={switchIsAdmin}
      >
        {!user.isAdmin ? "Add admin" : "Remove admin"}
      </button>
      <div className="flex flex-row justify-between">
        {user.dataFetched ? null : (
          <button
            className="rounded-lg p-1 bg-blue-500 hover:bg-sky-800 text-white mb-2 h-10 w-10"
            onClick={fetchUserData}
          >
            <ArrowDownOnSquareIcon />
          </button>
        )}
        <button className="rounded-lg p-1 bg-red-500 hover:bg-sky-800 text-white h-10 w-10">
          <TrashIcon />
        </button>
      </div>
    </div>
  );
}
