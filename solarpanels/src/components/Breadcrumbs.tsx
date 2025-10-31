
import { Link, useLocation } from "react-router-dom";
import "../styles/Breadcrumbs.css";

interface BreadcrumbItem {
  label: string;
  path: string;
}

interface BreadcrumbsProps {
  items?: BreadcrumbItem[];
}

function Breadcrumbs({ items }: BreadcrumbsProps) {
  const location = useLocation();

  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const paths = location.pathname.split("/").filter(Boolean);
    const breadcrumbs: BreadcrumbItem[] = [{ label: "Главная", path: "/" }];

    let currentPath = "";
    paths.forEach((path, index) => {
      currentPath += `/${path}`;
      if (path === "panels") {
        breadcrumbs.push({ label: "Каталог панелей", path: currentPath });
      } else if (!isNaN(Number(path)) && paths[index - 1] === "panel") {
        breadcrumbs.push({ label: "Детали панели", path: currentPath });
      }
    });

    return breadcrumbs;
  };

  const breadcrumbItems = items || generateBreadcrumbs();

  return (
    <nav aria-label="breadcrumb" className="breadcrumbs-container">
      <ol className="breadcrumbs">
        {breadcrumbItems.map((item, index) => {
          const isLast = index === breadcrumbItems.length - 1;
          return (
            <li key={item.path} className={`breadcrumb-item ${isLast ? "active" : ""}`}>
              {isLast ? (
                <span>{item.label}</span>
              ) : (
                <>
                  <Link to={item.path}>{item.label}</Link>
                  <span className="separator"> / </span>
                </>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export default Breadcrumbs;
