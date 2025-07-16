import { useMemo } from "react";
import useQuery from "../hooks/useQuery";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import FullScreenLoader from "../atoms/FullScreenLoader";

const Dashboard = () => {
  const statsQuery = useMemo(
    () => ({ method: "GET", path: "/candidate/stats" }),
    []
  );

  const { data: { body: { data } = { body: {} } } = {}, isLoading } =
    useQuery(statsQuery);

  const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7300", "#00C49F"];

  const statusChartData = useMemo(() => {
    if (!data?.countsByStatus) return [];
    return Object.entries(data.countsByStatus).map(([status, count]) => ({
      name: status,
      value: count,
    }));
  }, [data]);

  return (
    <div className="content-wrapper mt-5 mx-4 sm:mx-5 space-y-8">
      {isLoading && <FullScreenLoader />}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 mt-2 gap-4">
        <h1 className="text-2xl sm:text-4xl font-bold text-primary">
          Dashboard
        </h1>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-md">
        <h3 className="text-lg font-medium mb-3">
          Total Calls Today: {data?.totalCalls || 0}
        </h3>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={statusChartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#8884d8" name="Count" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-md">
        <h3 className="text-lg font-medium mb-3">Status Distribution</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={statusChartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill="#8884d8"
              label
            >
              {statusChartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Legend />
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Dashboard;
