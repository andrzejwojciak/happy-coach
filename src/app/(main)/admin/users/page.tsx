"use client";

import UserActions from "@/src/components/admin/users/user-actions";
import { User } from "@/src/lib/models/User";
import { getUsers } from "@/src/lib/actions/usersActions";
import { useEffect, useState } from "react";

export default function Users() {
  const [gridData, setGridData] = useState<User[]>();

  useEffect(() => {
    loadUsers();
  }, []);

  function loadUsers() {
    getUsers({ page: 0, perPage: 100 }).then((users) => {
      setGridData(users.data);
      console.log("zaladowanie!");
    });
  }

  return (
    <div className="w-400">
      <table className="w-full table-auto">
        <thead className="border-b-2">
          <tr>
            <th></th>
            <th>Id</th>
            <th>Email</th>
            <th>Display name</th>
            <th>Data fetched</th>
            <th>Is admin</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {gridData
            ? gridData.map((user) => {
                return (
                  <tr key={user.id} className="border-b-2">
                    <td>{gridData.indexOf(user) + 1}</td>
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
  );
}
