"use client";

import { useEffect, useState } from "react";

const API = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5010";
const DL = (path: string) => `${API}/api/v1/delivery${path}`;

interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  order: number;
}

interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: string;
  image: string;
  calories: string;
  allergens: string;
  videoUrl: string;
  badge: string;
  categorySlug: string;
}

export default function RestaurantMenuPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [catRes, modRes] = await Promise.all([
        fetch(DL("/categories")),
        fetch(DL("/modules")),
      ]);
      const catData = await catRes.json();
      const modData = await modRes.json();

      const cats: Category[] = catData.data || [];
      const modules = modData.data || [];
      const menuModule = modules.find((m: any) => m.slug === "menu-item");

      if (menuModule) {
        const contentRes = await fetch(
          DL(`/contents/module/${menuModule.id}`)
        );
        const contentData = await contentRes.json();
        const contents = contentData.data || [];

        const items: MenuItem[] = contents.map((c: any) => {
          let data = {};
          try {
            data = JSON.parse(c.dataJson || c.DataJson || "{}");
          } catch {}
          const d: any = data;
          return {
            id: c.id,
            name: d.name || "",
            description: d.description || "",
            price: d.price || "",
            image: d.image || "",
            calories: d.calories || "",
            allergens: d.allergens || "",
            videoUrl: d.videoUrl || "",
            badge: d.badge || "",
            categorySlug: "",
          };
        });

        // get category links from ContentCategories
        const catIds = cats.map((c) => c.id);
        const catLinkRes = await fetch(
          DL(`/categories?moduleId=${menuModule.id}`)
        );
        const catLinkData = await catLinkRes.json();
        const _ = catLinkData.data || [];

        setCategories(cats);
        setMenuItems(items);
      } else {
        setCategories(cats);
      }
    } catch (err) {
      console.error("Failed to load menu data", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = menuItems.filter((item) => {
    const matchesSearch =
      !search ||
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      !selectedCategory || item.categorySlug === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const cssVars = {
    "--bg": theme === "dark" ? "#050505" : "#f4f4f6",
    "--card": theme === "dark" ? "#141414" : "#ffffff",
    "--card2": theme === "dark" ? "#1d1d1d" : "#f1f1f1",
    "--text": theme === "dark" ? "#ffffff" : "#151515",
    "--muted": theme === "dark" ? "#b7b7b7" : "#666",
    "--red": "#97001f",
    "--red2": "#bd002f",
    "--border":
      theme === "dark"
        ? "rgba(255,255,255,.08)"
        : "rgba(0,0,0,.08)",
    "--shadow":
      theme === "dark"
        ? "0 16px 35px rgba(0,0,0,.35)"
        : "0 12px 28px rgba(0,0,0,.10)",
  } as React.CSSProperties;

  if (loading) {
    return (
      <div
        style={{
          ...cssVars,
          background: "var(--bg)",
          color: "var(--text)",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: "50%",
              border: "3px solid var(--red)",
              borderTopColor: "transparent",
              animation: "spin 1s linear infinite",
              margin: "0 auto 16px",
            }}
          />
          <p style={{ color: "var(--muted)", fontWeight: 700 }}>
            Loading menu...
          </p>
          <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        ...cssVars,
        background: "var(--bg)",
        color: "var(--text)",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif",
        minHeight: "100vh",
      }}
    >
      <div
        style={{
          maxWidth: 520,
          margin: "0 auto",
          paddingBottom: 92,
          background: "var(--bg)",
        }}
      >
        {/* Topbar */}
        <div
          style={{
            position: "sticky",
            top: 0,
            zIndex: 60,
            background: "linear-gradient(135deg, var(--red), var(--red2))",
            padding: "17px 15px 16px",
            borderBottomLeftRadius: 22,
            borderBottomRightRadius: 22,
            boxShadow: "var(--shadow)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div
                style={{
                  width: 58,
                  height: 58,
                  borderRadius: 16,
                  background: "rgba(255,255,255,.12)",
                  border: "1px solid rgba(255,255,255,.2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 21,
                  fontWeight: 900,
                  color: "#fff",
                }}
              >
                M
              </div>
              <div>
                <h1
                  style={{
                    margin: 0,
                    color: "#fff",
                    fontSize: 22,
                    fontWeight: 900,
                    lineHeight: 1,
                  }}
                >
                  Restaurant Menu
                </h1>
                <div
                  style={{
                    color: "rgba(255,255,255,.75)",
                    fontSize: 11,
                    letterSpacing: 1.8,
                    textTransform: "uppercase",
                    marginTop: 5,
                  }}
                >
                  Restaurant
                </div>
              </div>
            </div>

            <div style={{ display: "flex", gap: 8 }}>
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 14,
                  border: "1px solid rgba(255,255,255,.25)",
                  background: "rgba(255,255,255,.09)",
                  color: "#fff",
                  fontSize: 19,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {theme === "dark" ? "☾" : "☀"}
              </button>
            </div>
          </div>

          {/* Search */}
          <div
            style={{
              marginTop: 16,
              height: 54,
              background: theme === "dark" ? "#1b1b1b" : "#fff",
              border: "1px solid var(--border)",
              borderRadius: 15,
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "0 15px",
            }}
          >
            <span style={{ color: "#d8d8d8", fontSize: 18 }}>🔍</span>
            <input
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: "100%",
                border: 0,
                outline: 0,
                background: "transparent",
                color: theme === "dark" ? "#fff" : "#111",
                fontSize: 15,
                fontWeight: 600,
              }}
            />
          </div>
        </div>

        {/* Categories Grid */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "18px 15px 12px",
          }}
        >
          <h3 style={{ margin: 0, fontSize: 22, fontWeight: 900 }}>
            Categories
          </h3>
          {selectedCategory && (
            <button
              onClick={() => setSelectedCategory(null)}
              style={{
                color: "var(--muted)",
                textDecoration: "none",
                fontSize: 13,
                fontWeight: 800,
                background: "none",
                border: "none",
                cursor: "pointer",
              }}
            >
              Show All
            </button>
          )}
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 12,
            padding: "0 14px 22px",
          }}
        >
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.slug)}
              style={{
                minHeight: 138,
                borderRadius: 17,
                overflow: "hidden",
                background: "var(--card)",
                border:
                  selectedCategory === cat.slug
                    ? "2px solid var(--red2)"
                    : "1px solid var(--border)",
                position: "relative",
                color: "#fff",
                display: "block",
                boxShadow: "var(--shadow)",
                padding: 0,
                cursor: "pointer",
                width: "100%",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  padding: "38px 11px 12px",
                  background:
                    "linear-gradient(to top, rgba(0,0,0,.88), transparent)",
                  fontSize: 22,
                  fontWeight: 800,
                  textShadow: "0 2px 8px rgba(0,0,0,.7)",
                  minHeight: 138,
                  display: "flex",
                  alignItems: "flex-end",
                  justifyContent: "center",
                }}
              >
                {cat.name}
              </div>
            </button>
          ))}
        </div>

        {/* Menu Items */}
        {filteredItems.length > 0 && (
          <div style={{ padding: "0 14px 22px" }}>
            <h3
              style={{
                margin: "0 0 12px",
                fontSize: 22,
                fontWeight: 900,
              }}
            >
              {selectedCategory
                ? categories.find((c) => c.slug === selectedCategory)?.name
                : "All Items"}
            </h3>

            {filteredItems.map((item) => (
              <div
                key={item.id}
                style={{
                  display: "flex",
                  gap: 12,
                  background: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: 18,
                  padding: 10,
                  marginBottom: 12,
                  boxShadow: "var(--shadow)",
                }}
              >
                <div
                  style={{
                    width: 106,
                    height: 106,
                    borderRadius: 15,
                    overflow: "hidden",
                    background: "var(--card2)",
                    flex: "0 0 auto",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 32,
                    color: "var(--muted)",
                  }}
                >
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    "🍽"
                  )}
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: 17,
                      fontWeight: 900,
                      marginBottom: 6,
                    }}
                  >
                    {item.name}
                  </div>

                  {item.description && (
                    <div
                      style={{
                        fontSize: 13,
                        color: "var(--muted)",
                        lineHeight: 1.35,
                        marginBottom: 8,
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {item.description}
                    </div>
                  )}

                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 6,
                      marginBottom: 8,
                    }}
                  >
                    {item.badge && (
                      <span
                        style={{
                          background: "var(--card2)",
                          border: "1px solid var(--border)",
                          borderRadius: 999,
                          padding: "4px 8px",
                          color: "var(--muted)",
                          fontSize: 11,
                          fontWeight: 800,
                        }}
                      >
                        {item.badge}
                      </span>
                    )}
                    {item.calories && (
                      <span
                        style={{
                          background: "var(--card2)",
                          border: "1px solid var(--border)",
                          borderRadius: 999,
                          padding: "4px 8px",
                          color: "var(--muted)",
                          fontSize: 11,
                          fontWeight: 800,
                        }}
                      >
                        🔥 {item.calories} cal
                      </span>
                    )}
                  </div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 8,
                    }}
                  >
                    <span
                      style={{
                        fontSize: 17,
                        fontWeight: 900,
                        color: "var(--text)",
                      }}
                    >
                      {item.price}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {filteredItems.length === 0 && !loading && (
          <div
            style={{
              margin: "0 14px 20px",
              background: "var(--card)",
              border: "1px solid var(--border)",
              borderRadius: 18,
              padding: 22,
              textAlign: "center",
              color: "var(--muted)",
              fontWeight: 800,
            }}
          >
            {search
              ? "No products match your search"
              : "No menu items yet. Seed the restaurant data from the admin panel."}
          </div>
        )}

        {/* Footer */}
        <footer
          style={{
            color: "var(--muted)",
            fontSize: 13,
            textAlign: "center",
            padding: "24px 14px",
          }}
        >
          <div>All prices include VAT.</div>
          <div className="mt-2">
            © 2026 — <strong>Restaurant Menu System</strong>
          </div>
        </footer>
      </div>

      {/* Bottom Nav */}
      <div
        style={{
          position: "fixed",
          left: "50%",
          bottom: 0,
          transform: "translateX(-50%)",
          width: "100%",
          maxWidth: 520,
          height: 78,
          background: "linear-gradient(135deg, var(--red), var(--red2))",
          zIndex: 75,
          display: "grid",
          gridTemplateColumns: "repeat(4,1fr)",
          borderTopLeftRadius: 19,
          borderTopRightRadius: 19,
          overflow: "hidden",
        }}
      >
        <NavButton icon="🏠" label="Home" active />
        <NavButton icon="ℹ️" label="Info" />
        <NavButton icon="⭐" label="Review" />
        <NavButton icon="🕐" label="Hours" />
      </div>
    </div>
  );
}

function NavButton({
  icon,
  label,
  active,
}: {
  icon: string;
  label: string;
  active?: boolean;
}) {
  return (
    <button
      style={{
        color: "#fff",
        border: "none",
        borderRight: "1px solid rgba(255,255,255,.18)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 5,
        fontSize: 12,
        fontWeight: 700,
        background: active ? "rgba(255,255,255,.12)" : "transparent",
        cursor: "pointer",
        padding: 0,
      }}
    >
      <span style={{ fontSize: 24, lineHeight: 1 }}>{icon}</span>
      <span>{label}</span>
    </button>
  );
}
