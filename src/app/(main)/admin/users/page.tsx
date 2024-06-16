"use client";

import UserActions from "@/src/components/admin/users/user-actions";
import { User } from "@/src/lib/models/User";
import { getUsers } from "@/src/lib/actions/usersActions";
import { useEffect, useState } from "react";
import clsx from "clsx";

export default function Users() {
  const [gridData, setGridData] = useState<User[]>();

  useEffect(() => {
    loadUsers();
  }, []);

  function loadUsers() {
    getUsers({ page: 0, perPage: 100 }).then((users) => {
      setGridData(users.data);
    });
  }

  return (
    <div className="w-400">
      <div className="rounded-t-lg overflow-hidden">
        <table className="w-full table-auto">
          <thead className="bg-slate-500 text-white text-left">
            <tr className="h-12">
              <th className="font-normal pl-2 min-w-10"></th>
              <th className="font-normal">Id</th>
              <th className="font-normal">Email</th>
              <th className="font-normal">Display name</th>
              <th className="font-normal">Fetched</th>
              <th className="font-normal">Admin</th>
              <th className="font-normal"></th>
            </tr>
          </thead>
          <tbody>
            {gridData
              ? gridData.map((user) => {
                  return (
                    <tr
                      key={user.id}
                      className={clsx("", {
                        "bg-slate-100": gridData.indexOf(user) % 2 !== 0,
                      })}
                    >
                      <td className="pl-2">{gridData.indexOf(user) + 1}</td>
                      <td>{user.id}</td>
                      <td>{user.email}</td>
                      <td>{user.displayName ?? "anonim"}</td>
                      <td>{user.dataFetched ? "true" : "false"}</td>
                      <td>{user.isAdmin ? "true" : "false"}</td>
                      <td>
                        <UserActions user={user} loadUsers={loadUsers} />
                      </td>
                    </tr>
                  );
                })
              : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
