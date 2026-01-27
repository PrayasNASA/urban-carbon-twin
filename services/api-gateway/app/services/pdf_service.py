from fpdf import FPDF
import datetime

class ReportPDF(FPDF):
    def header(self):
        # Logo or Title
        self.set_font('Helvetica', 'B', 15)
        self.set_text_color(16, 185, 129) # Emerald Green
        self.cell(0, 10, 'Urban Carbon Twin', border=False, new_x="LMARGIN", new_y="NEXT", align='L')
        self.set_font('Helvetica', 'I', 10)
        self.set_text_color(128, 128, 128)
        self.cell(0, 5, 'AI-Integrated Strategic Analysis Report', border=False, new_x="LMARGIN", new_y="NEXT", align='L')
        self.ln(5)

    def footer(self):
        self.set_y(-15)
        self.set_font('Helvetica', 'I', 8)
        self.set_text_color(128, 128, 128)
        self.cell(0, 10, f'Page {self.page_no()}', align='C')

def create_report_pdf(analysis_data: dict, scenario_params: dict = None) -> bytes:
    """
    Generates a PDF report from the Gemini analysis and scenario data.
    Returns the PDF bytes.
    """
    pdf = ReportPDF()
    pdf.add_page()
    pdf.set_auto_page_break(auto=True, margin=15)

    # 1. Report Metadata
    pdf.set_font("Helvetica", size=10)
    pdf.set_text_color(0, 0, 0)
    timestamp = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    pdf.cell(0, 5, f"Generated: {timestamp}", new_x="LMARGIN", new_y="NEXT", align='R')
    pdf.ln(5)

    # 2. Executive Summary
    if "summary" in analysis_data:
        pdf.set_font("Helvetica", 'B', 12)
        pdf.set_fill_color(240, 253, 244) # Light Green
        pdf.cell(0, 8, "Executive Summary", border=False, fill=True, new_x="LMARGIN", new_y="NEXT")
        pdf.ln(2)
        pdf.set_font("Helvetica", size=11)
        pdf.multi_cell(0, 6, analysis_data["summary"])
        pdf.ln(5)

    # 3. Strategic Justification
    if "justification" in analysis_data:
        pdf.set_font("Helvetica", 'B', 12)
        pdf.cell(0, 8, "Strategic Justification", border=False, new_x="LMARGIN", new_y="NEXT")
        pdf.ln(2)
        pdf.set_font("Helvetica", size=11)
        pdf.multi_cell(0, 6, analysis_data["justification"])
        pdf.ln(5)

    # 4. Innovative Insight
    if "insight" in analysis_data:
        pdf.set_font("Helvetica", 'B', 12)
        pdf.cell(0, 8, "AI Innovative Suggestion", border=False, new_x="LMARGIN", new_y="NEXT")
        pdf.ln(2)
        pdf.set_font("Helvetica", 'I', 11)
        pdf.multi_cell(0, 6, f'"{analysis_data["insight"]}"')
        pdf.ln(5)

    # 5. Metrics & Confidence
    pdf.set_font("Helvetica", 'B', 12)
    pdf.cell(0, 8, "Key Metrics", border=False, new_x="LMARGIN", new_y="NEXT")
    pdf.ln(2)
    
    pdf.set_font("Helvetica", size=10)
    
    # Confidence Score Bar
    confidence = analysis_data.get("confidence", 0)
    pdf.cell(40, 6, "AI Confidence Score:", new_x="RIGHT", new_y="TOP")
    pdf.set_font("Helvetica", 'B', 10)
    pdf.cell(20, 6, f"{int(confidence * 100)}%", new_x="LMARGIN", new_y="NEXT")
    
    # Simple Visual Bar
    pdf.set_fill_color(229, 231, 235) # Gray bg
    pdf.rect(pdf.get_x(), pdf.get_y(), 100, 4, 'F')
    pdf.set_fill_color(16, 185, 129) # Green fill
    pdf.rect(pdf.get_x(), pdf.get_y(), 100 * confidence, 4, 'F')
    pdf.ln(8)

    # Scenario Params if available
    if scenario_params:
        pdf.set_font("Helvetica", 'B', 10)
        pdf.cell(0, 6, "Scenario Parameters:", new_x="LMARGIN", new_y="NEXT")
        pdf.set_font("Helvetica", size=10)
        for k, v in scenario_params.items():
            pdf.cell(50, 6, f"- {k}: {v}", new_x="LMARGIN", new_y="NEXT")

    return pdf.output()
