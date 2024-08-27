import React from "react";

const ConfigTable = ({ modemConfig }) => (
  <>
    <div className="stats stats-vertical bg-base-300 shadow my-4 rounded-none  grow">
      <div className="stat">
        <div className="stat-title">NORAD</div>
        <div className="stat-value text-blue-300">{modemConfig.NORAD}</div>
      </div>
      <div className="stat">
        <div className="stat-title">Frequency</div>
        <div className="stat-value text-blue-300">{modemConfig.freq}MHz</div>
      </div>
      <div className="stat">
        <div className="stat-title">Mode</div>
        <div className="stat-value text-blue-300">{modemConfig.mode}</div>
      </div>
    </div>
    <div className="stats stats-vertical bg-base-300 shadow my-4 rounded-none grow">
      <div className="stat">
        <div className="stat-title">Spreading Factor</div>
        <div className="stat-value text-blue-300">{modemConfig.sf}MHz</div>
      </div>

      <div className="stat">
        <div className="stat-title">Bandwidth</div>
        <div className="stat-value text-blue-300">{modemConfig.bw}MHz</div>
      </div>

      <div className="stat">
        <div className="stat-title">Coding Rate</div>
        <div className="stat-value text-blue-300">{modemConfig.cr}</div>
      </div>
    </div>
    <div className="stats stats-vertical bg-base-300 shadow my-4 rounded-none grow">
      <div className="stat">
        <div className="stat-title">Syncword</div>
        <div className="stat-value text-blue-300">
          0x{modemConfig.sw ? modemConfig.sw.toString(16) : 0}
        </div>
      </div>

      <div className="stat">
        <div className="stat-title">CRC</div>
        <div className="stat-value text-blue-300">
          {modemConfig.crc ? "Enabled" : "Disabled"}
        </div>
      </div>

      <div className="stat">
        <div className="stat-title">Preamble Length</div>
        <div className="stat-value text-blue-300">{modemConfig.pl} symbols</div>
      </div>
    </div>
    <div className="stats stats-vertical bg-base-300 shadow my-4 rounded-none mr-4 grow">
      <div className="stat">
        <div className="stat-title">TX Power</div>
        <div className="stat-value text-blue-300">{modemConfig.pwr} dBm</div>
      </div>

      <div className="stat">
        <div className="stat-title">Current Limit</div>
        <div className="stat-value text-blue-300">{modemConfig.cl} mA</div>
      </div>

      <div className="stat">
        <div className="stat-title">Gain</div>
        <div className="stat-value text-blue-300">{modemConfig.gain} dB</div>
      </div>
    </div>
  </>
);
export default ConfigTable;
