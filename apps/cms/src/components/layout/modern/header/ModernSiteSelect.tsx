"use client";
import React, { useEffect, useState, useTransition } from 'react';
import { Select, Divider, Button, Typography, Tag, Avatar, Space, Tooltip } from 'antd';
import {
  GlobalOutlined,
  PlusOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import api from '@/api/api-context';
import api_points from '@/api/points';
import { getCookie, setCookie } from '@/app/actions/set-cookie';
import { SiteId, SiteSlug } from '@/abstracts/siteSlug';
import { RootState } from '@/lib/redux-toolkit/store';
import { setLoading } from '@/lib/redux-toolkit/slice/ui-slice';
import { onChangeSite, setSiteId, setSiteSlug, setWebsites } from '@/lib/redux-toolkit/slice/site-slice';
import route_paths from '@/helper/route_paths';
import enumCreateUpdate from '@/abstracts/create-update';
import { toQueryString } from '@/helper/toQueryString';
import ISite from '@/abstracts/site';

const { Text } = Typography;
const { Option } = Select;


const ModernSiteSelect: React.FC = () => {
  const dispatch = useDispatch();
  const site = useSelector((state: RootState) => state.site);
  const router = useRouter();
  const [selectedSite, setSelectedSite] = useState<ISite | null>(null);
  const [isPending, startTransition] = useTransition();

  // Fetch websites
  const fetchSites = async () => {
    try {
      const siteSlug = await getCookie(SiteSlug);
      const params = {
        pageSize: 50,
        currentPage: 1
      };

      const response = await api.get(api_points.webSite.getAll + `?${toQueryString(params)}`);
      const websites = response.data.data;

      // Store in Redux
      dispatch(setWebsites(websites));

      // Set selected site if exists in cookie
      if (siteSlug && siteSlug.length) {
        const site = websites.find((site: ISite) => site.slug === siteSlug);
        setSelectedSite(site || null);
      }
    } catch (error) {
      console.error('Failed to fetch websites:', error);
    }
  };

  // Handle site change
  const handleSiteChange = (value: string | null) => {
    if (value) {
      const s = site.list.find(site => site.slug === value);
      if (s) {
        // Update cookies
        setCookie(SiteId, s.id.toString());
        setCookie(SiteSlug, value);

        // Update local state
        setSelectedSite(s);

        // Update Redux state
        dispatch(onChangeSite());
        dispatch(setLoading(true));

        // Simulate loading
        setTimeout(() => dispatch(setLoading(false)), 500);
      }
    } else {
      // Clear selection
      setCookie(SiteId, "");
      setCookie(SiteSlug, "");
      setSelectedSite(null);
      // dispatch(onChangeSite());
      dispatch(setSiteId(-1));
      dispatch(setSiteSlug(""));
    }
  };

  // Initialize on mount
  useEffect(() => {
    startTransition(() => { fetchSites(); });
  }, [site.changeSite]);

  useEffect(() => {
    setSelectedSite({
      name: site.name,
      slug: site.slug,
      description: site.description,
      id: site.id,
      link: site.link,
      published: site.published,
      role: site.role
    })
    console.info("sites.slug => ", site.slug);
  }, [site.id]);

  // Custom option renderer
  const renderOption = (site: ISite) => (
    <div className="site-option">
      <div className="site-info">
        <div className="site-header">
          <Avatar
            size={24}
            // src={site.favicon ? `${process.env.NEXT_PUBLIC_CDN}/${site.favicon}` : undefined}
            icon={<GlobalOutlined />}
            style={{
              background: site.published ? '#10b981' : '#f59e0b',
              marginRight: 8
            }}
          />
          <Text strong style={{ fontSize: 14 }}>
            {site.name}
          </Text>
          <div className="site-status">
            {site.published ? (
              <Tag color="success" icon={<CheckCircleOutlined />}>
                Live
              </Tag>
            ) : (
              <Tag color="warning" icon={<ExclamationCircleOutlined />}>
                Draft
              </Tag>
            )}
          </div>
        </div>
        {site.description && (
          <Text type="secondary" style={{ fontSize: 12, marginTop: 4, display: 'block' }}>
            {site.description}
          </Text>
        )}
        {site.link && (
          <Text type="secondary" style={{ fontSize: 11, marginTop: 2, display: 'block' }}>
            {site.link}
          </Text>
        )}
      </div>
    </div>
  );

  // Custom dropdown render
  const dropdownRender = (menu: React.ReactElement) => (
    <div className="site-select-dropdown">
      {menu}
      <Divider style={{ margin: '8px 0' }} />
      <div className="dropdown-footer">
        <Link href={`${route_paths.webSites}/${enumCreateUpdate.create}`}>
          <Button
            type="text"
            icon={<PlusOutlined />}
            block
            style={{
              textAlign: 'left',
              height: 40,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            Create New Website
          </Button>
        </Link>
        <Button
          type="text"
          icon={<SettingOutlined />}
          block
          style={{
            textAlign: 'left',
            height: 40,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
          onClick={() => router.push(route_paths.webSites)}
        >
          Manage Websites
        </Button>
      </div>
    </div>
  );

  return (
    <div className="modern-site-select">
      <Select
        value={selectedSite?.slug == "" ? undefined : selectedSite?.slug}
        placeholder={isPending ? "Loading websites..." : "Select a website"}
        onChange={handleSiteChange}
        allowClear
        loading={isPending}
        disabled={isPending}
        style={{
          minWidth: 280,
          maxWidth: 400,
        }}
        size="large"
        dropdownRender={dropdownRender}
        optionLabelProp="label"
        dropdownClassName="modern-site-select-dropdown"
      >
        {site.list.map((site: ISite, index: number) => (
          <Option
            key={site.slug}
            value={site.slug}
            label={
              <Space>
                <Avatar
                  size={20}
                  // src={site.favicon ? `${process.env.NEXT_PUBLIC_CDN}/${site.favicon}` : undefined}
                  icon={<GlobalOutlined />}
                  style={{ background: site.published ? '#10b981' : '#f59e0b' }}
                />
                <Text>{site.name}</Text>
                {site.published ? (
                  <Tag color="success">Live</Tag>
                ) : (
                  <Tag color="warning">Draft</Tag>
                )}
              </Space>
            }
          >
            {renderOption(site)}
          </Option>
        ))}
      </Select>

      {/* Selected site info */}
      {selectedSite && (
        <div className="selected-site-info">
          <Tooltip
            title={
              <div>
                <div><strong>{selectedSite.name}</strong></div>
                {selectedSite.description && <div>{selectedSite.description}</div>}
                {selectedSite.link && <div>link: {selectedSite.link}</div>}
                <div>Status: {selectedSite.published ? 'Published' : 'Draft'}</div>
              </div>
            }
          >
            <div className="site-indicator">
              <div
                className="site-dot"
                style={{
                  background: selectedSite.published ? '#10b981' : '#f59e0b'
                }}
              />
              <Text type="secondary" style={{ fontSize: 12 }}>
                {selectedSite.name}
              </Text>
            </div>
          </Tooltip>
        </div>
      )}

      <style jsx>{`
        .modern-site-select {
          display: flex;
          flex-direction: row;
          align-items: center;
          gap: 8px;
        }

        :global(.modern-site-select .ant-select) {
          border-radius: 12px;
        }

        :global(.modern-site-select .ant-select-selector) {
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          background: #f8fafc;
          transition: all 0.2s ease;
        }

        :global(.modern-site-select .ant-select-selector:hover) {
          border-color: #6366f1;
          background: white;
        }

        :global(.modern-site-select .ant-select-focused .ant-select-selector) {
          border-color: #6366f1;
          box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.1);
        }

        :global(.modern-site-select-dropdown) {
          border-radius: 12px;
          box-shadow: 0 10px 25px -5px rgb(0 0 0 / 0.1), 0 4px 6px -2px rgb(0 0 0 / 0.05);
          border: 1px solid #e2e8f0;
        }

        .site-select-dropdown {
          max-height: 400px;
          overflow-y: auto;
        }

        .site-option {
          padding: 8px 0;
        }

        .site-info {
          display: flex;
          flex-direction: column;
        }

        .site-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
        }

        .site-status {
          margin-left: auto;
        }

        .dropdown-footer {
          padding: 8px;
          background: #f8fafc;
          border-radius: 0 0 12px 12px;
        }

        .selected-site-info {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .site-indicator {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 4px 8px;
          background: #f1f5f9;
          border-radius: 6px;
          border: 1px solid #e2e8f0;
        }

        .site-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }

        @media (max-width: 768px) {
          .modern-site-select {
            width: 100%;
          }

          :global(.modern-site-select .ant-select) {
            width: 100%;
            min-width: auto;
          }
        }
      `}</style>
    </div>
  );
};

export default ModernSiteSelect;